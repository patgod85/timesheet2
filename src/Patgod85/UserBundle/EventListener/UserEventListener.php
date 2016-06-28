<?php

namespace Patgod85\UserBundle\EventListener;


use Doctrine\Common\Persistence\Event\LifecycleEventArgs;
use Doctrine\ORM\EntityManager;
use Patgod85\TeamBundle\Entity\Team;
use Patgod85\UserBundle\Entity\User;

class UserEventListener
{

    public function prePersist(LifecycleEventArgs $args)
    {
        /** @var User $entity */
        $entity = $args->getObject();
        /** @var EntityManager $em */
        $em = $args->getObjectManager();

        if ($entity instanceof User && $entity->getTeamId() && !$entity->getTeam()) {
            /** @var Team $team */
            $team = $em->getRepository('Patgod85TeamBundle:Team')->find($entity->getTeamId());

            $entity->setTeam($team);
        }
    }
}
