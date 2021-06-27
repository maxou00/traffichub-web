import { useEffect, useState } from "react";
import styles from "../styles/TrackerList.module.scss";
import { useHistory } from "react-router";
import cn from "classnames";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Form, Modal, Container, Input, Dropdown, List } from "semantic-ui-react";
import { Detached } from "./Detached";
import { MdArrowDropDown, MdClose } from "react-icons/md";
import { CREATE_TRACKER_MUTATION } from "../core/mutations";

interface Props {
    onSelected(tracker: any): void;
}

function TrackersList(props: Props) {
    const [modalState, setModalState] = useState("initial");
    const [protocol, setProtocol] = useState("https://");
    const [errors, setErrors] = useState<any>({});
    const [selectedTracker, setSelectedTracker] = useState<any>(undefined);
    const history = useHistory();

    const [createTracker, result] = useMutation(CREATE_TRACKER_MUTATION, {
        onCompleted: (r) => {
            setModalState("closed");
            let id = r.createTracker.id;
            if(refetch) {
                refetch()
            }
        },
        onError: (err) => {
            console.log(err);
        }
    });

    const { data, loading, error, refetch } = useQuery(gql`
        {
            trackers {
                id
                title
                url
                tag
                visitors {
                    total
                }
            }
        }
    `, {partialRefetch: true});

    useEffect(() => {
        if (data && data.trackers[0]) {
            goToSingleTracker(data.trackers[0]);
        }
    }, [data]);

    function goToSingleTracker(tracker: any) {
        setSelectedTracker(tracker);
        props.onSelected(tracker);
    }

    function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        let form = ev.target as HTMLFormElement;

        let trackerContent = {
            title: form.trackerTitle.value,
            url: form.trackerUrl.value
        }

        let newErrors: any = {};
        if (!trackerContent.title) {
            newErrors.title = "Indiquez le titre de votre traqueur";
        }

        if (!trackerContent.url) {
            newErrors.url = "Indiquez l'adresse du site internet à surveiller avec ce traqueur";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        trackerContent.url = protocol + trackerContent.url;

        createTracker({
            variables: {
                title: trackerContent.title,
                url: trackerContent.url
            }
        })
    }

    let httpOptions = [
        { key: "https", text: "https://", value: "https://" },
        { key: "http", text: "http://", value: "http://" },
    ]

    if (loading) {
        return <div>...chargement</div>
    }

    return <div className={styles.page}>
        <div className={styles.header}>
            <h5>
                Sites suivis
            </h5>
        </div>
        <div className={styles.content}>
            <List>
                {
                    data && data.trackers.map((t: any) => {
                        let active = selectedTracker && selectedTracker.id === t.id
                        return <List.Item key={t.id} active={active} className={cn({ [styles.menu_item]: true, [styles.active]: active })} onClick={() => goToSingleTracker(t)}>
                            <List.Content>
                                <List.Header className={styles.title}>{t.title}</List.Header>
                                <List.Description className={styles.url}>{t.url}</List.Description>
                            </List.Content>
                        </List.Item>
                    })
                }
            </List>
            <button className={styles.btnFollowWebsite} onClick={() => setModalState("open")}>Suivre un site</button>
        </div>

        <Detached unmountOnExit>
            <div className={styles.modal} data-state={modalState}>
                <div className={styles.modal__base}>
                    <div className={styles.modal__header}>
                        <h1>Monitorer un site</h1>
                        <button className={styles.modal__close} onClick={() => setModalState("closed")}>
                            <MdClose/>
                        </button>
                    </div>
                    <div className={styles.modal__content}>
                        <Container>
                            <Form onSubmit={onSubmit} className={styles.modal__form}>
                                <p className={styles.form__description}>
                                    Pour suivre votre traffic, vous obtiendrez une ligne de code à ajouter aux pages de votre site.
                                    Nous collecterons des informations relatives à l'emplacement géographique de vos visiteurs, les systèmes d'exploitation utilisés, les navigateurs, les différentes tailles d'écran et la page visitée sur votre site.
                                    Vos statistiques seront mises à jour au fur et à mesure, en fonction de l'affluence sur votre site.
                                </p>
                                <Input fluid error={errors.url} type="text" label={
                                    <Dropdown icon={<MdArrowDropDown/>} value={protocol} options={httpOptions} onChange={(ev, d) => setProtocol(d.value as string)} />} placeholder="Site à surveiller" name="trackerUrl" required />
                                <div style={{ height: '24px' }}></div>
                                <Form.Input fluid error={errors.title} type="text" label="Titre de votre site" name="trackerTitle" required />
                                <div style={{ height: '24px' }}></div>
                                <Form.Button fluid loading={result.loading} disabled={result.loading} color="orange">Suivre ce site</Form.Button>
                            </Form>
                        </Container>
                    </div>
                </div>
            </div>
        </Detached>

        <Modal open={false} onClose={() => setModalState("closed")}>
            <Modal.Header style={{ background: 'transparent' }}>Créer un Traqueur</Modal.Header>
            <Modal.Content style={{ background: 'transparent' }}>

            </Modal.Content>
        </Modal>
    </div>
}

export default TrackersList;