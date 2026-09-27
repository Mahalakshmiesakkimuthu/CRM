
import { useState, useEffect } from "react";

function RecentActivity() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/activities")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch activities");
                }

                return response.json();
            })
            .then((data) => {
                setActivities(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setError("Unable to load activities");
                setLoading(false);
            });
    }, []);

    return (
        <section className="activity">

            <div className="section-title">
                <h3>Recent Activity</h3>
            </div>

            {loading && <p>Loading...</p>}

            {error && <p>{error}</p>}

            {!loading && !error &&
                activities.slice(0, 5).map((activity) => (
                    <div className="activity-item" key={activity.id}>
                        <span>●</span>

                        <div>
                            <p>
                                {activity.title} - {activity.company}
                            </p>

                            <small>
                                {activity.date}
                            </small>
                        </div>
                    </div>
                ))
            }

        </section>
    );
}

export default RecentActivity;