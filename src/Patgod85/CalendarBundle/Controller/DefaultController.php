<?php

namespace Patgod85\CalendarBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('Patgod85CalendarBundle:Default:index.html.twig', array('name' => $name));
    }
}
