<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Models\ItemPrice;
use App\Models\Supermarket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ItemControllerTest extends TestCase
{
    use RefreshDatabase;


    public function test_index_returns_empty_list_when_no_items(): void
    {
        $response = $this->getJson('/api/items');

        $response->assertOk()
            ->assertJson(['items' => []]);
    }

    public function test_index_returns_all_items_with_correct_shape(): void
    {
        Item::factory()->count(3)->create();

        $response = $this->getJson('/api/items');

        $response->assertOk()
            ->assertJsonCount(3, 'items')
            ->assertJsonStructure([
                'items' => [
                    '*' => ['id', 'name', 'image_url', 'created_at', 'updated_at'],
                ],
            ]);
    }


    public function test_store_creates_item_and_returns_201(): void
    {
        $response = $this->postJson('/api/items', ['name' => 'Bread']);

        $response->assertCreated()
            ->assertJsonFragment(['name' => 'Bread']);

        $this->assertDatabaseHas('items', ['name' => 'Bread']);
    }

    public function test_store_uploads_image_to_garage(): void
    {
        Storage::fake('garage');
        $file = UploadedFile::fake()->create('milk.jpg', 100, 'image/jpeg');

        $response = $this->post('/api/items', [
            'name'  => 'Milk',
            'image' => $file,
        ]);

        $response->assertCreated();
        $this->assertNotNull($response->json('image_url'));
        Storage::disk('garage')->assertExists('items/' . $file->hashName());
    }

    public function test_store_rejects_missing_name(): void
    {
        $this->postJson('/api/items', [])->assertUnprocessable();
    }

    public function test_store_rejects_non_image_file(): void
    {
        $this->postJson('/api/items', [
            'name'  => 'Eggs',
            'image' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
        ])->assertUnprocessable();
    }

    public function test_store_rejects_name_exceeding_max_length(): void
    {
        $this->postJson('/api/items', [
            'name' => str_repeat('a', 256),
        ])->assertUnprocessable();
    }


    public function test_show_returns_item_with_prices_and_supermarkets(): void
    {
        $item        = Item::factory()->create();
        $supermarket = Supermarket::factory()->create();
        ItemPrice::create(['item_id' => $item->id, 'supermarket_id' => $supermarket->id, 'price' => 199]);

        $response = $this->getJson("/api/items/{$item->id}");

        $response->assertOk()
            ->assertJsonStructure([
                'id', 'name', 'image_url', 'created_at', 'updated_at',
                'prices' => [
                    '*' => [
                        'id', 'price',
                        'supermarket' => ['id', 'name'],
                    ],
                ],
            ])
            ->assertJsonPath('prices.0.price', 199)
            ->assertJsonPath('prices.0.supermarket.id', $supermarket->id);
    }

    public function test_show_returns_item_with_empty_prices_when_none_exist(): void
    {
        $item = Item::factory()->create();

        $response = $this->getJson("/api/items/{$item->id}");

        $response->assertOk()
            ->assertJsonPath('prices', []);
    }

    public function test_show_returns_404_for_nonexistent_item(): void
    {
        $this->getJson('/api/items/9999')->assertNotFound();
    }


    public function test_update_modifies_item_name(): void
    {
        $item = Item::factory()->create(['name' => 'Old Name']);

        $response = $this->patchJson("/api/items/{$item->id}", ['name' => 'New Name']);

        $response->assertOk()
            ->assertJsonFragment(['name' => 'New Name']);

        $this->assertDatabaseHas('items', ['id' => $item->id, 'name' => 'New Name']);
    }

    public function test_update_uploads_new_image(): void
    {
        Storage::fake('garage');
        $item = Item::factory()->create(['image_url' => null]);
        $file = UploadedFile::fake()->create('new.jpg', 100, 'image/jpeg');

        $response = $this->patch("/api/items/{$item->id}", ['image' => $file]);

        $response->assertOk();
        $this->assertNotNull($response->json('image_url'));
        Storage::disk('garage')->assertExists('items/' . $file->hashName());
    }

    public function test_update_rejects_non_image_file(): void
    {
        $item = Item::factory()->create();

        $this->patchJson("/api/items/{$item->id}", [
            'image' => UploadedFile::fake()->create('doc.pdf', 100, 'application/pdf'),
        ])->assertUnprocessable();
    }

    public function test_update_returns_404_for_nonexistent_item(): void
    {
        $this->patchJson('/api/items/9999', ['name' => 'x'])->assertNotFound();
    }


    public function test_destroy_deletes_item_and_returns_204(): void
    {
        $item = Item::factory()->create();

        $this->deleteJson("/api/items/{$item->id}")->assertNoContent();

        $this->assertDatabaseMissing('items', ['id' => $item->id]);
    }

    public function test_destroy_returns_404_for_nonexistent_item(): void
    {
        $this->deleteJson('/api/items/9999')->assertNotFound();
    }


    public function test_index_returns_timestamps_in_iso8601_utc_format(): void
    {
        Item::factory()->create();

        $response = $this->getJson('/api/items');

        $item = $response->json('items.0');
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $item['created_at']);
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $item['updated_at']);
    }

    public function test_show_returns_timestamps_in_iso8601_utc_format(): void
    {
        $item = Item::factory()->create();

        $response = $this->getJson("/api/items/{$item->id}");

        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $response->json('created_at'));
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $response->json('updated_at'));
    }

    public function test_store_returns_timestamps_in_iso8601_utc_format(): void
    {
        $response = $this->postJson('/api/items', ['name' => 'Bread']);

        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $response->json('created_at'));
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $response->json('updated_at'));
    }

    public function test_update_returns_timestamps_in_iso8601_utc_format(): void
    {
        $item = Item::factory()->create();

        $response = $this->patchJson("/api/items/{$item->id}", ['name' => 'Updated']);

        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $response->json('created_at'));
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $response->json('updated_at'));
    }
}
