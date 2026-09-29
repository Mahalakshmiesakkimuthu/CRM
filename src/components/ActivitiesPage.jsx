import { useState, useEffect } from "react";

function ActivitiesPage() {
    const [activities, setActivities] = useState([]);

    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        type: "Call",
        company: "",
        date: "",
        status: "Pending"
    });

    // GET activities
    useEffect(() => {
        fetch("https://crm-backend-l81t.onrender.com/activities")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch activities");
                }

                return response.json();
            })
            .then((data) => {
                console.log(data);
                setActivities(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setFetchError("Unable to load activities");
                setLoading(false);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.company || !formData.date) {
            setError("Please fill all fields");
            return;
        }

        setError("");

        if (editIndex !== null) {
            // UPDATE activity
            fetch(
                `https://crm-backend-l81t.onrender.com/activities/${editIndex}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to update activity");
                    }

                    return response.json();
                })
                .then((data) => {
                    console.log(data);

                    return fetch(
                        "https://crm-backend-l81t.onrender.com/activities"
                    );
                })
                .then((response) => response.json())
                .then((activitiesData) => {
                    setActivities(activitiesData);
                })
                .catch((error) => {
                    console.log(error);
                    setError("Unable to update activity");
                });

            setEditIndex(null);
        } else {
            // ADD activity
            fetch("https://crm-backend-l81t.onrender.com/activities", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to add activity");
                    }

                    return response.json();
                })
                .then((data) => {
                    console.log(data);

                    return fetch(
                        "https://crm-backend-l81t.onrender.com/activities"
                    );
                })
                .then((response) => response.json())
                .then((activitiesData) => {
                    setActivities(activitiesData);
                })
                .catch((error) => {
                    console.log(error);
                    setError("Unable to add activity");
                });
        }

        setFormData({
            title: "",
            type: "Call",
            company: "",
            date: "",
            status: "Pending"
        });

        setShowForm(false);
    };

    const handleDelete = (id) => {
        fetch(
            `https://crm-backend-l81t.onrender.com/activities/${id}`,
            {
                method: "DELETE"
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete activity");
                }

                return response.json();
            })
            .then((data) => {
                console.log(data);

                return fetch(
                    "https://crm-backend-l81t.onrender.com/activities"
                );
            })
            .then((response) => response.json())
            .then((activitiesData) => {
                setActivities(activitiesData);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleEdit = (id) => {
        const activity = activities.find(
            (activity) => activity.id === id
        );

        setFormData({
            title: activity.title,
            type: activity.type,
            company: activity.company,
            date: activity.date,
            status: activity.status
        });

        setEditIndex(id);
        setShowForm(true);
        setError("");
    };

    const filteredActivities = activities.filter(
        (activity) =>
            activity.title
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            activity.company
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            activity.type
                .toLowerCase()
                .includes(search.toLowerCase())
    );

    return (
        <section className="activities-page">

            <div className="activities-page-header">

                <div>
                    <h2>Activities</h2>
                    <p>Track calls, meetings and follow-ups</p>
                </div>

                <button
                    onClick={() => {
                        setEditIndex(null);

                        setFormData({
                            title: "",
                            type: "Call",
                            company: "",
                            date: "",
                            status: "Pending"
                        });

                        setError("");
                        setShowForm(true);
                    }}
                >
                    + Add Activity
                </button>

            </div>

            <div className="activities-list">

                <h3>Recent Activities</h3>

                <input
                    type="text"
                    placeholder="Search activities..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {loading && (
                    <p>Loading...</p>
                )}

                {fetchError && (
                    <p>{fetchError}</p>
                )}

                {!loading &&
                    !fetchError &&
                    filteredActivities.map((activity) => (

                        <div
                            className="activity-row"
                            key={activity.id}
                        >

                            <div className="activity-icon">
                                {activity.type === "Call" && "☎"}
                                {activity.type === "Email" && "✉"}
                                {activity.type === "Meeting" && "●"}
                                {activity.type === "Follow-up" && "✓"}
                            </div>

                            <div className="activity-content">

                                <p>
                                    {activity.title}
                                </p>

                                <small>
                                    {activity.date} · {activity.company}
                                </small>

                            </div>

                            <span>
                                {activity.type}
                            </span>

                            <button
                                onClick={() =>
                                    handleEdit(activity.id)
                                }
                            >
                                Edit
                            </button>

                            <button
                                onClick={() =>
                                    handleDelete(activity.id)
                                }
                            >
                                Delete
                            </button>

                        </div>

                    ))}

            </div>

            {showForm && (

                <form
                    className="activity-form"
                    onSubmit={handleSubmit}
                >

                    {error && (
                        <p className="form-error">
                            {error}
                        </p>
                    )}

                    <input
                        type="text"
                        placeholder="Activity Title"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                title: e.target.value
                            })
                        }
                    />

                    <select
                        value={formData.type}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                type: e.target.value
                            })
                        }
                    >
                        <option>Call</option>
                        <option>Email</option>
                        <option>Meeting</option>
                        <option>Follow-up</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Company"
                        value={formData.company}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                company: e.target.value
                            })
                        }
                    />

                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                date: e.target.value
                            })
                        }
                    />

                    <select
                        value={formData.status}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                status: e.target.value
                            })
                        }
                    >
                        <option>Pending</option>
                        <option>Completed</option>
                    </select>

                    <button type="submit">
                        {editIndex !== null
                            ? "Update Activity"
                            : "Save Activity"}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setEditIndex(null);
                            setError("");
                        }}
                    >
                        Cancel
                    </button>

                </form>

            )}

        </section>
    );
}

export default ActivitiesPage;