<?php

namespace Patgod85\EmployeeBundle\Controller;

use AppBundle\Controller\ErrorsJsonizer;
use Patgod85\EmployeeBundle\Entity\Employee;
use Patgod85\EmployeeBundle\Form\EmployeeType;

use FOS\RestBundle\Controller\Annotations\QueryParam;
use FOS\RestBundle\Controller\Annotations\RouteResource;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Request\ParamFetcherInterface;
use FOS\RestBundle\Util\Codes;
use FOS\RestBundle\View\View as FOSView;
use Patgod85\UserBundle\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Voryx\RESTGeneratorBundle\Controller\VoryxController;

/**
 * Employee controller.
 * @RouteResource("Employee")
 */
class EmployeeRESTController extends VoryxController
{
    use ErrorsJsonizer;

    public function checkRights(User $user, Employee $entity)
    {
        if(!$user->isSuperAdmin() && $entity->getTeamId() != $user->getTeamId())
        {
            throw new AccessDeniedHttpException();
        }
    }

    /**
     * Get a Employee entity
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @return Response
     *
     */
    public function getAction(Employee $entity)
    {
        $this->checkRights($this->getUser(), $entity);

        return $entity;
    }
    /**
     * Get all Employee entities.
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
            $entities = $em->getRepository('Patgod85EmployeeBundle:Employee')->findBy($filters, $order_by, $limit, $offset);
            if ($entities) {
                return $entities;
            }

            return FOSView::create('Not Found', Codes::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return FOSView::create($e->getMessage(), Codes::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Create a Employee entity.
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

        $entity = new Employee();

        $form = $this->createForm(
            new EmployeeType(),
            $entity,
            [
                'method' => $request->getMethod(),
                'allow_extra_fields' => true
            ]
        );

//        $form->add('teamId');
//        $form->add('name');
//        $form->add('surname');
//        $form->add('position');
//        $form->add('workStart');
//        $form->add('workEnd');
//        $form->setData($entity);

        $form->handleRequest($request);
//
        $team = $this->getDoctrine()->getManager()->getRepository('Patgod85TeamBundle:Team')->find($request->get('teamId'));
//        $entity->setName($request->get('name'));
//        $entity->setSurname($request->get('surname'));
//        $entity->setPosition($request->get('position'));
//        $entity->setTeamId($request->get('teamId'));
//        $entity->setWorkStart($request->get('workStart'));
//        $entity->setWorkEnd($request->get('workEnd'));
        $entity->setTeam($team);

        $defaultCalendar = <<<eot
BEGIN:VCALENDAR
PRODID:-//Microsoft Corporation//Outlook 16.0 MIMEDIR//EN
VERSION:2.0
METHOD:PUBLISH
X-CALSTART:20151231T173000Z
X-CALEND:20160205T000000
X-WR-RELCALID:{0000002E-D841-8F49-253F-D866E67EFE6B}
X-WR-CALNAME:default
BEGIN:VTIMEZONE
TZID:Europe/Moscow
BEGIN:STANDARD
DTSTART:16010101T000000
TZOFFSETFROM:+0300
TZOFFSETTO:+0300
END:STANDARD
END:VTIMEZONE
END:VCALENDAR
eot;

        if(!$entity->getCalendar())
        {
            $entity->setCalendar($defaultCalendar);
        }


        $this->checkRights($this->getUser(), $entity);

        if ($form->isValid())
        {
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
     * Update a Employee entity.
     *
     * @View(serializerEnableMaxDepthChecks=true)
     * @param Request $request
     * @param Employee $entity
     * @return Response
     */
    public function putAction(Request $request, Employee $entity)
    {
        $this->checkRights($this->getUser(), $entity);

        try
        {
            $em = $this->getDoctrine()->getManager();
            $request->setMethod('PATCH'); //Treat all PUTs as PATCH
            $form = $this->createForm(new EmployeeType(), $entity, array("method" => $request->getMethod()));
            $this->removeExtraFields($request, $form);
            $form->handleRequest($request);

            if ($form->isValid()) {
                $em->flush();

                return $entity;
            }
            else
            {
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
        catch (\Exception $e)
        {
            return FOSView::create($e->getMessage(), Codes::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Partial Update to a Employee entity.
     *
     * @View(serializerEnableMaxDepthChecks=true)
     *
     * @param Request $request
     * @param $entity
     *
     * @return Response
     */
    public function patchAction(Request $request, Employee $entity)
    {
        return $this->putAction($request, $entity);
    }
    /**
     * Delete a Employee entity.
     *
     * @View(statusCode=204)
     *
     * @param Request $request
     * @param $entity
     *
     * @return Response
     */
    public function deleteAction(Request $request, Employee $entity)
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
