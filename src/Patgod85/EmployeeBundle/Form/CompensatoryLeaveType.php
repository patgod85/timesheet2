<?php

namespace Patgod85\EmployeeBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class CompensatoryLeaveType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('description')
            ->add('value')
            ->add('date', 'datetime', [
                'format' => 'yyyy-MM-dd',
                'widget' => 'single_text',
                'model_timezone' => 'Europe/London',
                'view_timezone' => 'Europe/London',
            ])
            ->add('employeeId')
        ;
    }
    
    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Patgod85\EmployeeBundle\Entity\CompensatoryLeave'
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'patgod85_employeebundle_compensatory_leave';
    }
}
