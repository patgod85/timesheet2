<?php

namespace Patgod85\UserBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->remove('username')
            ->add('name')
            ->add('surname')
            ->add('username', 'hidden', ['label' => 'form.username', 'translation_domain' => 'FOSUserBundle'])
//            ->add('teamId')
        ;

//        $options['allow_extra_fields'] = true;
    }

    public function getName()
    {
        return 'patgod85_user_registration';
    }

    public function getParent()
    {
        return "fos_user_registration";
    }
}

