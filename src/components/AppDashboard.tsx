import { gql, useQuery } from "@apollo/client";
import styles from "../styles/AppDashboard.module.scss";
import { Header, Icon } from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
import TrackingPoint from "./TrackingPoint";
import cn from "classnames";
import TrackersList from "./TrackerList";
import { useEffect, useState } from "react";
import { MdHome, MdNotifications, MdSettings } from "react-icons/md";

function AppDashboard() {
    const [selectedTracker, setSelectedTracker] = useState<any>(undefined);
    const history = useHistory();
    const { data, loading, error } = useQuery(
        gql`
            {
                me {
                    id
                    fullName
                }
            }
        `
    )


    useEffect(() => {
        if (error) {
            history.replace("/login");
        }
    }, [error, history]);

    if (error) {
        return <></>
    }

    if (loading) {
        return <div>...chargement</div>
    }

    return <div className={styles.dashboard}>
        <div className={styles.header}>
            <div className={styles.logoWrapper}>
                <h1 className={styles.title}>TrafficHub</h1>
            </div>
            <div className={styles.headerContent}>
                <span className={cn(styles.item, styles.username)}>Bienvenue, <strong>{data.me.fullName}</strong></span>
                <Link className={styles.item} to="/app/">
                    <MdHome/>
                </Link>
                <Link className={styles.item} to="/app/">
                    <MdNotifications />
                </Link>
                <Link className={styles.item} to="/app/">
                    <MdSettings />
                </Link>
            </div>
        </div>
        <div className={styles.side} data-active={true}>
            <TrackersList onSelected={(tracker) => setSelectedTracker(tracker)} />
        </div>
        <div className={styles.content}>
            {
                selectedTracker &&
                <TrackingPoint tracker={selectedTracker}/>
            }
        </div>
    </div>
}

export default AppDashboard;