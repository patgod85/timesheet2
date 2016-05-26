<?php

namespace Patgod85\CalendarBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="calendar")
 * @ORM\Entity
 */
class Calendar
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var bool
     *
     * @ORM\Column(name="is_default", type="boolean", nullable=false, options={"default": 0})
     */
    private $isDefault;

    /**
     * @var string
     *
     * @ORM\Column(name="calendar", type="text", nullable=false)
     */
    private $calendar;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return boolean
     */
    public function isIsDefault()
    {
        return $this->isDefault;
    }

    /**
     * @param boolean $isDefault
     */
    public function setIsDefault($isDefault)
    {
        $this->isDefault = $isDefault;
    }

    /**
     * @return string
     */
    public function getCalendar()
    {
        return $this->calendar;
    }

    /**
     * @param string $calendar
     */
    public function setCalendar($calendar)
    {
        $this->calendar = $calendar;
    }

}
