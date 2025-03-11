<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Output\ConsoleOutput;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Factory::create();
        $users = User::pluck('id')->toArray();

        $batchSize = 1000; // Rozmiar partii
        $totalRecords = 1_000_000; // Całkowita liczba rekordów

        // Inicjalizacja paska postępu
        $output = new ConsoleOutput();
        $progressBar = new ProgressBar($output, $totalRecords);
        $progressBar->start();

        DB::beginTransaction();

        try {
            for ($i = 0; $i < $totalRecords; $i += $batchSize) {
                $articles = [];

                for ($j = 0; $j < $batchSize; $j++) {
                    $articles[] = [
                        'title' => $faker->sentence(),
                        'body' => $faker->paragraphs(3, true),
                        'user_id' => $faker->randomElement($users),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                Article::insert($articles);

                // Aktualizacja paska postępu
                $progressBar->advance($batchSize);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            dump($e->getMessage());
            throw $e;
        }

        // Zakończenie paska postępu
        $progressBar->finish();
        $output->writeln(''); // Nowa linia po zakończeniu
    }
}
