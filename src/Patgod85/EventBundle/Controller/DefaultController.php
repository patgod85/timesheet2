<?php

namespace Patgod85\EventBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('Patgod85EventBundle:Default:index.html.twig', array('name' => $name));
    }
}
