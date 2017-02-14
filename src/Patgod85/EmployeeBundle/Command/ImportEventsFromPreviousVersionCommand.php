<?php

namespace Patgod85\EmployeeBundle\Command;


use AppBundle\Entity\EmployeeDay;
use Patgod85\EmployeeBundle\Entity\Employee;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ImportEventsFromPreviousVersionCommand extends ContainerAwareCommand
{
    /** @var  OutputInterface */
    private $output;

    protected function configure()
    {
        $this
            ->setName('employee:import-data')
            ->setDescription('If data already present in table EMPLOYEE_DAY then the command will convert it into ical format and paste it into the EMPLOYEE table');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->output = $output;

        $this->convert();

        $this->output->writeln('Done');
    }

    private function convert()
    {
        $em = $this->getContainer()->get('doctrine')->getManager();

        $days = $em->getRepository('AppBundle:EmployeeDay')->findAll();

        $events = [];

        /** @var EmployeeDay $day */
        foreach ($days as $day)
        {

            if(!isset($events[$day->getEmployeeId()]))
            {
                $events[$day->getEmployeeId()] = [];
            }

            $date = $day->getDate()->format('Ymd');

            $events[$day->getEmployeeId()][] = <<<eot
BEGIN:VEVENT
SUMMARY:t2:d:{$day->getDayTypeId()}\;
DTSTART;VALUE=DATE:$date
DTEND;VALUE=DATE:$date
END:VEVENT
eot;

        }


        $employeeRepository = $em->getRepository('Patgod85EmployeeBundle:Employee');

        foreach ($events as $employeeId => $event)
        {
            $eventsStr = implode("\n", $event);

            $calendar = <<<eot
BEGIN:VCALENDAR
PRODID:-//Microsoft Corporation//Outlook 16.0 MIMEDIR//EN
VERSION:2.0
METHOD:PUBLISH
X-CALSTART:20151231T173000Z
X-CALEND:20160205T000000
X-WR-RELCALID:{0000002E-D841-8F49-253F-D866E67EFE6B}
X-WR-CALNAME:default
BEGIN:VTIMEZONE
TZID:Europe/Moscow
BEGIN:STANDARD
DTSTART:16010101T000000
TZOFFSETFROM:+0300
TZOFFSETTO:+0300
END:STANDARD
END:VTIMEZONE
$eventsStr
END:VCALENDAR
eot;

            /** @var Employee $employee */
            $employee = $employeeRepository->find($employeeId);

            if($employee)
            {
                $employee->setCalendar($calendar);
            }
            else
            {
                print_r([$employeeId]);
            }

        }

        $em->flush();

    }
}