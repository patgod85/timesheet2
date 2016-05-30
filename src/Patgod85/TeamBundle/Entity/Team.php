<?php

namespace Patgod85\TeamBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;
use Patgod85\EmployeeBundle\Entity\Employee;
use Patgod85\UserBundle\Entity\User;

/**
 * Team
 *
 * @ORM\Table(name="team", uniqueConstraints={@ORM\UniqueConstraint(name="id", columns={"id"}), @ORM\UniqueConstraint(name="code", columns={"code"})})
 * @ORM\Entity
 * @Serializer\ExclusionPolicy("all")
 */
class Team
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @Serializer\Expose
     * @Serializer\Type("integer")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, nullable=false)
     * @Serializer\Expose
     * @Serializer\Type("string")
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="code", type="string", length=255, nullable=false)
     * @Serializer\Expose
     * @Serializer\Type("string")
     */
    private $code;

    /**
     * @ORM\OneToMany(targetEntity="\Patgod85\UserBundle\Entity\User", mappedBy="team", cascade={"merge"})
     * @ORM\OrderBy({"username" = "ASC"})
     */
    private $users;

    /**
     * @ORM\OneToMany(targetEntity="\Patgod85\EmployeeBundle\Entity\Employee", mappedBy="team", cascade={"merge"})
     * @ORM\OrderBy({"surname" = "ASC"})
     */
    private $employees;

    /**
     * @var string
     *
     * @ORM\Column(name="calendar", type="text", nullable=false)
     * @Serializer\Expose
     * @Serializer\Type("string")
     */
    private $calendar;

    /**
     * @var boolean
     * @ORM\Column(name="is_general_calendar_enabled", type="boolean", nullable=false, options={"default": 1})
     * @Serializer\Expose
     * @Serializer\Type("boolean")
     */
    private $isGeneralCalendarEnabled;

    /**
     * Team constructor.
     */
    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->employees = new ArrayCollection();
    }

    /**
     * @return array
     * @Serializer\VirtualProperty
     * @Serializer\SerializedName("employees")
     */
    public function getEmployeesIds()
    {
        return array_map(
            function(Employee $employee){
                return $employee->getId();
            },
            $this->employees->toArray()
        );
    }

    /**
     * @return array
     * @Serializer\VirtualProperty
     * @Serializer\SerializedName("users")
     */
    public function getUsersIds()
    {
        return array_map(
            function(User $user){
                return $user->getId();
            },
            $this->users->toArray()
        );
    }



    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Team
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set code
     *
     * @param string $code
     *
     * @return Team
     */
    public function setCode($code)
    {
        $this->code = $code;

        return $this;
    }

    /**
     * Get code
     *
     * @return string
     */
    public function getCode()
    {
        return $this->code;
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

    /**
     * @return boolean
     */
    public function isGeneralCalendarEnabled()
    {
        return $this->isGeneralCalendarEnabled;
    }

    /**
     * @param boolean $isGeneralCalendarEnabled
     */
    public function setIsGeneralCalendarEnabled($isGeneralCalendarEnabled)
    {
        $this->isGeneralCalendarEnabled = $isGeneralCalendarEnabled;
    }


}
