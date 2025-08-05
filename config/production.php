<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Production Environment Settings
    |--------------------------------------------------------------------------
    |
    | This file contains production-specific configuration settings
    | that should be applied when deploying to production.
    |
    */

    'debug' => false,
    'log_level' => 'error',
    'cache_driver' => 'file',
    'session_driver' => 'file',
    'queue_connection' => 'sync',
    
    // Disable Telescope in production
    'telescope_enabled' => false,
    
    // Optimize for performance
    'optimize' => true,
    'cache_config' => true,
    'cache_routes' => true,
    'cache_views' => true,
]; 