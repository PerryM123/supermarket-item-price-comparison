<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SupermarketFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->company(),
        ];
    }
}
