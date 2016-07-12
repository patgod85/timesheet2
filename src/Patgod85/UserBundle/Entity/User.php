<?php

namespace Patgod85\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Model\User as BaseUser;
use Patgod85\TeamBundle\Entity\Team;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation as Serializer;

/**
 * User
 *
 * @ORM\Table(name="user", uniqueConstraints={@ORM\UniqueConstraint(name="id", columns={"id"}), @ORM\UniqueConstraint(name="email", columns={"email"})})
 * @ORM\Entity
 * @Serializer\ExclusionPolicy("all")
 */
class User extends BaseUser
{
    const ROLE_DEFAULT = 'ROLE_DEFAULT';

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @Serializer\Expose
     * @Serializer\Type("integer")
     */
    protected $id;

    /**
     * @var string
     * @Assert\NotBlank(message="Please enter a name.", groups={"Registration", "Profile"})
     * @Assert\Length(
     *     min=3,
     *     max=255,
     *     minMessage="The name is too short.",
     *     maxMessage="The name is too long.",
     *     groups={"Registration", "Profile"}
     * )
     * @ORM\Column(name="name", type="string", length=255, nullable=false)
     * @Serializer\Expose
     * @Serializer\Type("string")
     */
    private $name;

    /**
     * @var string
     * @Assert\NotBlank(message="Please enter a surname.", groups={"Registration", "Profile"})
     * @Assert\Length(
     *     min=3,
     *     max=255,
     *     minMessage="The name is too short.",
     *     maxMessage="The name is too long.",
     *     groups={"Registration", "Profile"}
     * )
     * @ORM\Column(name="surname", type="string", length=255, nullable=false)
     * @Serializer\Expose
     * @Serializer\Type("string")
     */
    private $surname;

    /**
     * @var integer
     *
     * @ORM\Column(name="team_id", type="integer", nullable=false)
     * @Serializer\Expose
     * @Serializer\Type("integer")
     */
    private $teamId;

    /**
     * @var Team
     * @ORM\ManyToOne(targetEntity="\Patgod85\TeamBundle\Entity\Team", inversedBy="users")
     * @ORM\JoinColumn(name="team_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $team;

    /**
     * @var array
     * @Assert\Choice(choices = {"ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"}, multiple=true, multipleMessage="Invalid role name")
     * @Serializer\Expose
     * @Serializer\Type("array<string>")
     */
    protected $roles;

    /**
     * @Assert\NotNull(message="Username cannot be null.", groups={"Registration", "Profile"})
     * @Serializer\Expose
     * @Serializer\Type("string")
     * @var string
     */
    protected $username;

    /**
     * @Serializer\Expose
     * @Serializer\Type("boolean")
     * @var bool
     */
    protected $enabled;

    /**
     * @return Team
     */
    public function getTeam()
    {
        return $this->team;
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
     * Set password
     *
     * @param string $password
     *
     * @return User
     */
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Get password
     *
     * @return string
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return User
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
     * @return User
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
     * Set teamId
     *
     * @param integer $teamId
     *
     * @return User
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
     * @param Team $team
     */
    public function setTeam($team)
    {
        $this->team = $team;
    }

}
