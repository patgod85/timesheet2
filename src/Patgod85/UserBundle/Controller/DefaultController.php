<?php

namespace Patgod85\UserBundle\Controller;

use JMS\Serializer\Serializer;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
    public function whoamiAction()
    {
        /** @var Serializer $serializer */
        $serializer = $this->container->get('serializer');

        $response  = new Response($serializer->serialize($this->getUser(), 'json'));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}
