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

        if(!$formFields)
        {
            $formFields['email'] = $request->get('email');
            $formFields['name'] = $request->get('name');
            $formFields['surname'] = $request->get('surname');
            $formFields['teamId'] = $request->get('teamId');
            $formFields['plainPassword'] = [
                'first' => $request->get('plainPassword'),
                'second' => $request->get('plainPassword'),
            ];
            $formFields['roles'] = $request->get('roles');
        }

        $formFields['username'] = $formFields['email'];

        $request->request->set('fos_user_registration_form', $formFields);
//var_dump($request->get('fos_user_registration_form'));die;
    }
}
