import { useEffect, useState } from "react";
import styles from "../styles/Singleproject.module.scss";
import { useHistory } from "react-router";
import TrackingPoint from "./TrackingPoint";
import cn from "classnames";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Form, Header, Modal, Input, Dropdown, List } from "semantic-ui-react";
import CustomIcon from "./CustomIcon";
import { CREATE_TRACKER_MUTATION } from "../core/mutations";

function TrackersList() {
    const [createTrackerOpen, setCreateTrackerOpen] = useState(false);
    const [protocol, setProtocol] = useState("https://");
    const [errors, setErrors] = useState<any>({});
    const [selectedTracker, setSelectedTracker] = useState<any>(undefined);
    const history = useHistory();

    const [createTracker, result] = useMutation(CREATE_TRACKER_MUTATION, {
        onCompleted: (r) => {
            refetch();
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
                visitors {
                    total
                }
            }
        }
    `);

    useEffect(() => {
        if (data && data.trackers[0]) {
            goToSingleTracker(data.trackers[0]);
        }
    }, [data]);

    function goToSingleTracker(tracker: any) {
        setSelectedTracker(tracker);
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
    <div className={styles.page__side}>
        <div className={styles.side__header}>
            <Header>
                Traqueurs
            </Header>
        </div>
        <List>
            {
                data.trackers.map((t: any) => {
                    let active = selectedTracker && selectedTracker.id === t.id
                    return <List.Item key={t.id} active={active} className={cn({ [styles.menu_item]: true, [styles.active]: active })} onClick={() => goToSingleTracker(t)}>
                        <List.Content>
                            <List.Header>{t.title}</List.Header>
                            <List.Description>{t.url}</List.Description>
                        </List.Content>
                    </List.Item>
                })
            }
        </List>
        <Button fluid color="orange">Nouveau traqueur</Button>
    </div>
    <div className={styles.page__content}>
        {
            selectedTracker &&
            <TrackingPoint tracker={selectedTracker} project={data} />
        }
    </div>
    <Modal open={createTrackerOpen} onClose={() => setCreateTrackerOpen(false)} className={styles.modal}>
            <Modal.Header style={{ background: 'transparent' }}>Créer un projet</Modal.Header>
            <Modal.Content style={{ background: 'transparent' }}>
                <Form onSubmit={onSubmit}>
                    <Form.Input inverted fluid error={errors.title} type="text" label="Titre de votre projet" name="projectTitle" required />
                    <Form.TextArea error={errors.comment} label="Commentaire" name="projectComment"></Form.TextArea>
                    <Header>Ajoutez votre premier traqueur à ce projet</Header>
                    <Input fluid error={errors.trackerUrl} type="text" label={
                        <Dropdown value={protocol} options={httpOptions} onChange={(ev, d) => setProtocol(d.value as string)} />} placeholder="Site à surveiller" name="trackerUrl" required />
                    <div style={{ height: '16px' }}></div>
                    <Form.Input fluid error={errors.trackerTitle} type="text" label="Titre du traqueur" name="trackerTitle" required />
                    <Form.Button loading={result.loading} disabled={result.loading} color="orange">
                        Créer le projet
                    </Form.Button>
                </Form>
            </Modal.Content>
        </Modal>
</div>
}

export default TrackersList;