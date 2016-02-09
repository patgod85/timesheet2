<?php

namespace Patgod85\UserBundle\Tests\Functional;


use Patgod85\UserBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Security\Core\Encoder\EncoderFactory;

class Encoder extends WebTestCase
{
    public function testEncoder()
    {
        $client = static::createClient();

        /** @var EncoderFactory $factory */
        $factory = $client->getContainer()->get('security.encoder_factory');
        $user = new User();

        $encoder = $factory->getEncoder($user);
        $password = $encoder->encodePassword('victor', $user->getSalt());

        print_r([$password]);
    }
}