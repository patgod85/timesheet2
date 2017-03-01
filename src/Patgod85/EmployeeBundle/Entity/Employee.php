<?php

namespace Patgod85\EmployeeBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Patgod85\TeamBundle\Entity\Team;
use JMS\Serializer\Annotation as Serializer;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Employee
 *
 * @ORM\Table(name="employee", uniqueConstraints={@ORM\UniqueConstraint(name="id", columns={"id"})})
 * @ORM\Entity
 * @Serializer\ExclusionPolicy("all")
 */
class Employee
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
     * @Assert\NotBlank(message="Please enter a name.")
     * @Assert\Length(
     *     min=1,
     *     max=255,
     *     minMessage="The name is too short.",
     *     maxMessage="The name is too long."
     * )
     * @Serializer\Expose
     * @Serializer\Type("string")
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="surname", type="string", length=255, nullable=false)
     * @Assert\NotBlank(message="Please enter a surname.")
     * @Assert\Length(
     *     min=1,
     *     max=255,
     *     minMessage="The name is too short.",
     *     maxMessage="The name is too long."
     * )
     * @Serializer\Expose
     * @Serializer\Type("string")
     */
    private $surname;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="work_start", type="date", nullable=true)
     * @Serializer\Expose
     * @Serializer\Type("DateTime<'Y-m-d'>")
     */
    private $workStart;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="work_end", type="date", nullable=true)
     * @Serializer\Expose
     * @Serializer\Type("DateTime<'Y-m-d'>")
     */
    private $workEnd;

    /**
     * @var integer
     *
     * @ORM\Column(name="team_id", type="integer", nullable=false)
     * @Serializer\Expose
     * @Serializer\Type("integer")
     */
    private $teamId;

    /**
     * @var string
     * @ORM\Column(name="position", type="string", length=255, nullable=true)
     * @Serializer\Expose
     * @Serializer\Type("string")
     */
    private $position;

    /**
     * @var Team
     * @ORM\ManyToOne(targetEntity="\Patgod85\TeamBundle\Entity\Team", inversedBy="employees")
     * @ORM\JoinColumn(name="team_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $team;

    /**
     * @var string
     * @ORM\Column(name="calendar", type="text", nullable=false)
     * @Serializer\Expose
     * @Serializer\Type("string")
     */
    private $calendar;

    /**
     * @ORM\OneToMany(targetEntity="\Patgod85\EmployeeBundle\Entity\CompensatoryLeave", mappedBy="employee", cascade={"merge"})
     * @ORM\OrderBy({"date" = "ASC"})
     */
    private $compensatoryLeaves;

    /**
     * @return array
     * @Serializer\VirtualProperty
     * @Serializer\SerializedName("compensatoryLeaves")
     */
    public function getCompensatoryLeavesIds()
    {
        return array_map(
            function(CompensatoryLeave $leave){
                return $leave->getId();
            },
            $this->compensatoryLeaves->toArray()
        );
    }

    /**
     * Employee constructor.
     */
    public function __construct()
    {
        $this->compensatoryLeaves = new ArrayCollection();
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
     * @return Employee
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
     * Set surname
     *
     * @param string $surname
     *
     * @return Employee
     */
    public function setSurname($surname)
    {
        $this->surname = $surname;

        return $this;
    }

    /**
     * Get surname
     *
     * @return string
     */
    public function getSurname()
    {
        return $this->surname;
    }

    /**
     * Set workStart
     *
     * @param \DateTime $workStart
     *
     * @return Employee
     */
    public function setWorkStart($workStart)
    {
        $this->workStart = $workStart;

        return $this;
    }

    /**
     * Get workStart
     *
     * @return \DateTime
     */
    public function getWorkStart()
    {
        return $this->workStart;
    }

    /**
     * Set workEnd
     *
     * @param \DateTime $workEnd
     *
     * @return Employee
     */
    public function setWorkEnd($workEnd)
    {
        $this->workEnd = $workEnd;

        return $this;
    }

    /**
     * Get workEnd
     *
     * @return \DateTime
     */
    public function getWorkEnd()
    {
        return $this->workEnd;
    }

    /**
     * Set teamId
     *
     * @param integer $teamId
     *
     * @return Employee
     */
    public function setTeamId($teamId)
    {
        $this->teamId = $teamId;

        return $this;
    }

    /**
     * Get teamId
     *
     * @return integer
     */
    public function getTeamId()
    {
        return $this->teamId;
    }

    /**
     * Set position
     *
     * @param string $position
     *
     * @return Employee
     */
    public function setPosition($position)
    {
        $this->position = $position;

        return $this;
    }

    /**
     * Get position
     *
     * @return string
     */
    public function getPosition()
    {
        return $this->position;
    }

    /**
     * @return Team
     */
    public function getTeam()
    {
        return $this->team;
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
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return ArrayCollection
     */
    public function getCompensatoryLeaves()
    {
        return $this->compensatoryLeaves;
    }

    /**
     * @param CompensatoryLeave $compensatoryLeave
     */
    public function addCompensatoryLeaves($compensatoryLeave)
    {
        $this->compensatoryLeaves->add($compensatoryLeave);
    }

    /**
     * @param Team $team
     */
    public function setTeam($team)
    {
        $this->team = $team;
    }


}
