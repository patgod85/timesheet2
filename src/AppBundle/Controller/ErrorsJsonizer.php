<?php

namespace AppBundle\Controller;


use Symfony\Component\Form\FormInterface;

trait ErrorsJsonizer
{

    protected function getErrorMessages(FormInterface $form)
    {
        $errors = array();

        foreach ($form->getErrors() as $key => $error)
        {
            if ($form->isRoot())
            {
                $errors[] = '#: '.$error->getMessage();
            }
            else
            {
                $errors[] = $error->getMessage().'. '.implode(', ', $error->getMessageParameters());
            }
        }

        foreach ($form->all() as $child)
        {
            if (!$child->isValid())
            {
                $errorMessages = $this->getErrorMessages($child);

                if(is_array($errorMessages))
                {
                    $errors = array_merge($errors, $errorMessages);
                }
                else
                {
                    $errors[] = $child->getName().': '.$errorMessages;
                }
            }
        }

        return $errors;
    }
}