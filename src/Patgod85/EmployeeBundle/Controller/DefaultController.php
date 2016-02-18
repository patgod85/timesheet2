<?php

namespace Patgod85\EmployeeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('Patgod85EmployeeBundle:Default:index.html.twig', array('name' => $name));
    }
}
