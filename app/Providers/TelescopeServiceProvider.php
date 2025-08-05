<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class TelescopeServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Only register Telescope in local environment
        if ($this->app->environment('local')) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(\App\Providers\TelescopeApplicationServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Only configure Telescope in local environment
        if ($this->app->environment('local')) {
            $this->configureTelescope();
        }
    }

    /**
     * Configure Telescope for local environment.
     */
    protected function configureTelescope(): void
    {
        if (!class_exists(\Laravel\Telescope\Telescope::class)) {
            return;
        }

        $telescope = \Laravel\Telescope\Telescope::class;
        $incomingEntry = \Laravel\Telescope\IncomingEntry::class;

        $telescope::filter(function ($entry) {
            return $entry->isReportableException() ||
                   $entry->isFailedRequest() ||
                   $entry->isFailedJob() ||
                   $entry->isScheduledTask() ||
                   $entry->hasMonitoredTag();
        });
    }
}
