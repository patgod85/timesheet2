<?php

namespace Patgod85\TeamBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('Patgod85TeamBundle:Default:index.html.twig', array('name' => $name));
    }
}
