<?php

namespace Patgod85\EmployeeBundle\Tests\Command;

use Patgod85\EmployeeBundle\Command\ImportEventsFromPreviousVersionCommand;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ImportEventsFromPreviousVersionCommandTest extends KernelTestCase
{
    public function testExecute()
    {
        $kernel = $this->createKernel();
        $kernel->boot();

        $application = new Application($kernel);
        $application->add(new ImportEventsFromPreviousVersionCommand());

        $command = $application->find('employee:import-data');
        $commandTester = new CommandTester($command);

        print_r($commandTester->getDisplay());
    }
}