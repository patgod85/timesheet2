<?php

namespace Patgod85\EmployeeBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class EmployeeType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name')
            ->add('surname')
            ->add('workStart', 'datetime', [
                'format' => 'yyyy-MM-dd',
                'widget' => 'single_text',
                'model_timezone' => 'Europe/London',
                'view_timezone' => 'Europe/London',
            ])
            ->add('workEnd', 'datetime', [
                'format' => 'yyyy-MM-dd',
                'widget' => 'single_text',
                'model_timezone' => 'Europe/London',
                'view_timezone' => 'Europe/London',
            ])
            ->add('teamId')
            ->add('position')
            ->add('calendar')
        ;
    }
    
    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Patgod85\EmployeeBundle\Entity\Employee'
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'patgod85_employeebundle_employee';
    }
}
