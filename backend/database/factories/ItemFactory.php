<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'      => $this->faker->unique()->words(2, true),
            'image_url' => null,
        ];
    }

    public function withImage(): static
    {
        return $this->state(['image_url' => $this->faker->imageUrl()]);
    }
}
