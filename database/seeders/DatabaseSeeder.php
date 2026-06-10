<?php

namespace Database\Seeders;

use App\Models\Platform;
use App\Models\CommonIssue;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Test Users
        User::create([
            'name' => 'Standard User',
            'email' => 'user@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);

        User::create([
            'name' => 'IT Support Admin',
            'email' => 'it@example.com',
            'password' => bcrypt('password'),
            'role' => 'it',
        ]);

        // 2. Define Platforms and their Common Issues
        $platformsData = [
            [
                'name' => 'ERP System',
                'description' => 'Enterprise Resource Planning software for company operations, financials, and inventory tracking.',
                'issues' => [
                    ['title' => 'Login Failure', 'description' => 'Unable to sign in using Active Directory credentials.'],
                    ['title' => 'Dashboard Slow Performance', 'description' => 'Financial metrics dashboard takes over 30 seconds to load.'],
                    ['title' => 'Report Export Error', 'description' => 'Receiving 500 error when exporting quarterly sales to Excel.'],
                    ['title' => 'Access Denied / Permissions', 'description' => 'Need approval to access the procurement module.'],
                ]
            ],
            [
                'name' => 'Customer Portal',
                'description' => 'Public facing e-commerce and customer ticket submission web portal.',
                'issues' => [
                    ['title' => 'Password Reset Email Not Sent', 'description' => 'Customers reporting that reset links are not arriving in their inbox.'],
                    ['title' => 'Checkout Payment Gateway Error', 'description' => 'Stripe transaction fails intermittently at checkout.'],
                    ['title' => 'Broken Images / SSL Warnings', 'description' => 'Browsers showing mixed-content warnings on product detail pages.'],
                ]
            ],
            [
                'name' => 'Office WiFi & Network',
                'description' => 'Physical and wireless connectivity in corporate offices.',
                'issues' => [
                    ['title' => 'Guest WiFi Disconnects', 'description' => 'Clients and guests getting kicked off the network every 10 minutes.'],
                    ['title' => 'VPN Connection Timeout', 'description' => 'FortiClient VPN fails to connect from home network.'],
                    ['title' => 'Ethernet Port Inactive', 'description' => 'Wall jack near desk 4B has no network activity light.'],
                ]
            ],
            [
                'name' => 'Email & Office Suite',
                'description' => 'Corporate Outlook, Microsoft 365, Teams, and cloud storage files.',
                'issues' => [
                    ['title' => 'Cannot Send External Emails', 'description' => 'Outgoing emails to client domains bounced back by security policy.'],
                    ['title' => 'Outlook Desktop App Freezes', 'description' => 'Outlook crashes during loading profile or syncing inbox.'],
                    ['title' => 'Teams Video/Audio Lag', 'description' => 'Experiencing high jitter and microphone cutting out during calls.'],
                ]
            ],
            [
                'name' => 'Hardware & Peripherals',
                'description' => 'Laptops, monitors, printing hubs, keyboards, and other physical gear.',
                'issues' => [
                    ['title' => 'Printer Jam / Toner Low', 'description' => 'The main copier on Level 3 has paper jam in tray 2.'],
                    ['title' => 'External Monitor Not Detected', 'description' => 'USB-C docking station does not display output to dual screens.'],
                    ['title' => 'Laptop Overheating / Swollen Battery', 'description' => 'Laptop trackpad is bulging or fans running constantly at 100%.'],
                ]
            ],
            [
                'name' => 'Other',
                'description' => 'Submit any other software, hardware, peripheral issues, or general support requests.',
                'issues' => [
                    ['title' => 'General Support Inquiry', 'description' => 'General questions or assistance not falling under specific platforms.'],
                    ['title' => 'Other Issue / Wrench Request', 'description' => 'A custom issue. Please describe the details of the problem in full.'],
                ]
            ]
        ];

        // 3. Seed Platforms and Issues
        foreach ($platformsData as $platformItem) {
            $platform = Platform::create([
                'name' => $platformItem['name'],
                'description' => $platformItem['description']
            ]);

            foreach ($platformItem['issues'] as $issueItem) {
                CommonIssue::create([
                    'platform_id' => $platform->id,
                    'title' => $issueItem['title'],
                    'description' => $issueItem['description']
                ]);
            }
        }
    }
}
