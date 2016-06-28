<?php

namespace Patgod85\UserBundle\EventListener;

use FOS\UserBundle\Event\UserEvent;


/**
 * Listener responsible to change the redirection at the end of the password resetting
 */
class RegistrationListener
{
    public function onFosuserRegistrationInitialize(UserEvent $event)
    {
        $request = $event->getRequest();
        $formFields = $request->get('fos_user_registration_form');
        $formFields['username'] = $formFields['email'];


//print_r($formFields);die;

        $request->request->set('fos_user_registration_form', $formFields);
    }
}
