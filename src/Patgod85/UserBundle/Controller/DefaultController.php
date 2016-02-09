<?php

namespace Patgod85\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('Patgod85UserBundle:Default:index.html.twig', array('name' => $name));
    }
}
