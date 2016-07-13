<?php

namespace Patgod85\UserBundle\Controller;

use AppBundle\Controller\ErrorsJsonizer;
use Doctrine\DBAL\Exception\ConstraintViolationException;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\FOSUserEvents;
use Patgod85\UserBundle\Entity\User;
use Patgod85\UserBundle\Form\RegistrationFormType;
use Patgod85\UserBundle\Form\UserType;

use FOS\RestBundle\Controller\Annotations\QueryParam;
use FOS\RestBundle\Controller\Annotations\RouteResource;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Request\ParamFetcherInterface;
use FOS\RestBundle\Util\Codes;
use FOS\RestBundle\View\View as FOSView;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Form;
use Symfony\Component\Form\FormError;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Voryx\RESTGeneratorBundle\Controller\VoryxController;

/**
 * User controller.
 * @RouteResource("User")
 */
class UserRESTController extends VoryxController
{
    use ErrorsJsonizer;

    public function checkRights(User $user, User $entity)
    {
        if(!$user->isSuperAdmin() && $entity->getTeamId() != $user->getTeamId())
        {
            throw new AccessDeniedHttpException();
        }
    }

    /**
     * Get a User entity
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @return Response
     *
     */
    public function getAction(User $entity)
    {
        $this->checkRights($this->getUser(), $entity);

        return $entity;
    }
    /**
     * Get all User entities.
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @param ParamFetcherInterface $paramFetcher
     *
     * @return Response
     *
     * @QueryParam(name="offset", requirements="\d+", nullable=true, description="Offset from which to start listing notes.")
     * @QueryParam(name="limit", requirements="\d+", default="20", description="How many notes to return.")
     * @QueryParam(name="order_by", nullable=true, array=true, description="Order by fields. Must be an array ie. &order_by[name]=ASC&order_by[description]=DESC")
     * @QueryParam(name="filters", nullable=true, array=true, description="Filter by fields. Must be an array ie. &filters[id]=3")
     */
    public function cgetAction(ParamFetcherInterface $paramFetcher)
    {
        try {
            $offset = $paramFetcher->get('offset');
            $limit = $paramFetcher->get('limit');
            $order_by = $paramFetcher->get('order_by');
            $filters = !is_null($paramFetcher->get('filters')) ? $paramFetcher->get('filters') : array();

            /** @var User $user */
            $user = $this->getUser();

            if(!$user->isSuperAdmin())
            {
                $filters['teamId'] = $user->getTeamId();
            }

            $em = $this->getDoctrine()->getManager();
            $entities = $em->getRepository('Patgod85UserBundle:User')->findBy($filters, $order_by, $limit, $offset);
            if ($entities) {
                return $entities;
            }

            return FOSView::create('Not Found', Codes::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return FOSView::create($e->getMessage(), Codes::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Create a User entity.
     *
     * @View(statusCode=201, serializerEnableMaxDepthChecks=true)
     *
     * @param Request $request
     *
     * @return Response
     *
     */
    public function postAction(Request $request)
    {
        /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');
        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->get('fos_user.registration.form.factory');
        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        /** @var User $entity */
        $entity = $userManager->createUser();
        $entity->setEnabled(true);

        $event = new GetResponseUserEvent($entity, $request);
        $dispatcher->dispatch(FOSUserEvents::REGISTRATION_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        /** @var Form $form */
        $form = $formFactory->createForm();
        $form->add('teamId');
        $form->add('roles');
        $form->add('name');
        $form->add('surname');
        $form->setData($entity);

        $entity->setUsername($entity->getEmail());
        $entity->setName($request->get('name'));
        $entity->setSurname($request->get('surname'));
        $entity->setTeamId($request->get('teamId'));
        $entity->setRoles($request->get('roles'));

        $form->handleRequest($request);

        $this->checkRights($this->getUser(), $entity);

        if ($form->isValid())
        {
            $event = new FormEvent($form, $request);
            $dispatcher->dispatch(FOSUserEvents::REGISTRATION_SUCCESS, $event);

            $userManager->updateUser($entity);

            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $entity;
        }
        else
        {
//var_dump($this->getErrorMessages($form));die;
            return FOSView::create(
                [
                    'errors' => array_map(
                        function($item){
                            return ['detail' => $item];
                        },
                        $this->getErrorMessages($form)
                    )
                ],
                Codes::HTTP_UNPROCESSABLE_ENTITY
            );
        }
    }

    /**
     * Update a User entity.
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @param Request $request
     * @param $entity
     *
     * @return Response
     */
    public function putAction(Request $request, User $entity)
    {
        $this->checkRights($this->getUser(), $entity);

        try {
            $em = $this->getDoctrine()->getManager();
            $request->setMethod('PATCH'); //Treat all PUTs as PATCH
            $form = $this->createForm(new UserType(), $entity, ["method" => $request->getMethod()]);

            $this->removeExtraFields($request, $form);

            $form->handleRequest($request);

            $entity->setRoles($request->request->get('roles'));

            if ($form->isValid()) {
                $em->flush();

                return $entity;
            }
            return FOSView::create(array('errors' => $form->getErrors()), Codes::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return FOSView::create($e->getMessage(), Codes::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Partial Update to a User entity.
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @param Request $request
     * @param $entity
     *
     * @return Response
     */
    public function patchAction(Request $request, User $entity)
    {
        return $this->putAction($request, $entity);
    }
    /**
     * Delete a User entity.
     *
     * @View(statusCode=204)
     *
     * @param Request $request
     * @param $entity
     *
     * @return Response
     */
    public function deleteAction(Request $request, User $entity)
    {
        $this->checkRights($this->getUser(), $entity);

        try {
            $em = $this->getDoctrine()->getManager();
            $em->remove($entity);
            $em->flush();

            return null;
        } catch (\Exception $e) {
            return FOSView::create($e->getMessage(), Codes::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
