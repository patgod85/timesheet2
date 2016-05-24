<?php

namespace Patgod85\EventBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class EventType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name')
            ->add('title')
            ->add('code')
            ->add('isDiapason')
            ->add('backgroundColor')
            ->add('color')
        ;
    }
    
    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Patgod85\EventBundle\Entity\Event'
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'patgod85_eventbundle_event';
    }
}
