<?php

namespace Tests\Feature;

use App\Models\Supermarket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SupermarketControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_empty_list_when_no_supermarkets(): void
    {
        $response = $this->getJson('/api/supermarkets');

        $response->assertOk()
            ->assertJson(['supermarkets' => []]);
    }

    public function test_index_returns_all_supermarkets(): void
    {
        Supermarket::factory()->count(3)->create();

        $response = $this->getJson('/api/supermarkets');

        $response->assertOk()
            ->assertJsonCount(3, 'supermarkets');
    }

    public function test_store_creates_supermarket_and_returns_201(): void
    {
        $response = $this->postJson('/api/supermarkets', ['name' => 'Tesco']);

        $response->assertCreated()
            ->assertJsonFragment(['name' => 'Tesco']);

        $this->assertDatabaseHas('supermarkets', ['name' => 'Tesco']);
    }

    public function test_store_rejects_missing_name(): void
    {
        $this->postJson('/api/supermarkets', [])->assertUnprocessable();
    }

    public function test_store_rejects_name_exceeding_max_length(): void
    {
        $this->postJson('/api/supermarkets', [
            'name' => str_repeat('a', 256),
        ])->assertUnprocessable();
    }

    public function test_show_returns_supermarket(): void
    {
        $supermarket = Supermarket::factory()->create();

        $response = $this->getJson("/api/supermarkets/{$supermarket->id}");

        $response->assertOk()
            ->assertJsonFragment(['id' => $supermarket->id, 'name' => $supermarket->name]);
    }

    public function test_show_returns_404_for_nonexistent_supermarket(): void
    {
        $this->getJson('/api/supermarkets/9999')->assertNotFound();
    }

    public function test_update_modifies_supermarket_name(): void
    {
        $supermarket = Supermarket::factory()->create(['name' => 'Old Name']);

        $response = $this->patchJson("/api/supermarkets/{$supermarket->id}", ['name' => 'New Name']);

        $response->assertOk()
            ->assertJsonFragment(['name' => 'New Name']);

        $this->assertDatabaseHas('supermarkets', ['id' => $supermarket->id, 'name' => 'New Name']);
    }

    public function test_update_rejects_empty_name(): void
    {
        $supermarket = Supermarket::factory()->create();

        $this->patchJson("/api/supermarkets/{$supermarket->id}", ['name' => ''])
            ->assertUnprocessable();
    }

    public function test_update_returns_404_for_nonexistent_supermarket(): void
    {
        $this->patchJson('/api/supermarkets/9999', ['name' => 'x'])->assertNotFound();
    }

    public function test_destroy_deletes_supermarket_and_returns_204(): void
    {
        $supermarket = Supermarket::factory()->create();

        $this->deleteJson("/api/supermarkets/{$supermarket->id}")->assertNoContent();

        $this->assertDatabaseMissing('supermarkets', ['id' => $supermarket->id]);
    }

    public function test_destroy_returns_404_for_nonexistent_supermarket(): void
    {
        $this->deleteJson('/api/supermarkets/9999')->assertNotFound();
    }


    public function test_index_returns_timestamps_in_iso8601_utc_format(): void
    {
        Supermarket::factory()->create();

        $response = $this->getJson('/api/supermarkets');

        $supermarket = $response->json('supermarkets.0');
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $supermarket['created_at']);
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $supermarket['updated_at']);
    }

    public function test_show_returns_timestamps_in_iso8601_utc_format(): void
    {
        $supermarket = Supermarket::factory()->create();

        $response = $this->getJson("/api/supermarkets/{$supermarket->id}");

        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $response->json('created_at'));
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $response->json('updated_at'));
    }

    public function test_store_returns_timestamps_in_iso8601_utc_format(): void
    {
        $response = $this->postJson('/api/supermarkets', ['name' => 'Tesco']);

        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $response->json('created_at'));
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $response->json('updated_at'));
    }

    public function test_update_returns_timestamps_in_iso8601_utc_format(): void
    {
        $supermarket = Supermarket::factory()->create();

        $response = $this->patchJson("/api/supermarkets/{$supermarket->id}", ['name' => 'Updated']);

        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $response->json('created_at'));
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $response->json('updated_at'));
    }
}
