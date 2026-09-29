import { useState, useEffect } from "react";

function PipelinePage() {
    const [deals, setDeals] = useState([]);

    const [stats, setStats] = useState({
        totalDeals: 0,
        pipelineValue: 0,
        closedWon: 0,
        winRate: 0
    });

    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");
    const [statsError, setStatsError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [editIndex, setEditIndex] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        company: "",
        value: "",
        stage: "Lead",
        owner: ""
    });

    // Dashboard statistics
    useEffect(() => {
        fetch("https://crm-backend-l81t.onrender.com/dashboard")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch dashboard stats");
                }

                return response.json();
            })
            .then((data) => {
                setStats(data);
            })
            .catch((error) => {
                console.log(error);
                setStatsError("Unable to load dashboard stats");
            });
    }, []);

    // Pipeline deals
    useEffect(() => {
        fetch("https://crm-backend-l81t.onrender.com/pipeline")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch pipeline");
                }

                return response.json();
            })
            .then((data) => {
                setDeals(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setFetchError("Unable to load pipeline data");
                setLoading(false);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.company || !formData.value) {
            setError("Please fill all fields");
            return;
        }

        if (isNaN(formData.value)) {
            setError("Value must be a number");
            return;
        }

        setError("");

        if (editIndex !== null) {
            const id = deals[editIndex].id;

            fetch(
                `https://crm-backend-l81t.onrender.com/pipeline/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);

                    fetch(
                        "https://crm-backend-l81t.onrender.com/pipeline"
                    )
                        .then((response) => response.json())
                        .then((pipelineData) => {
                            setDeals(pipelineData);
                        });
                });

            setEditIndex(null);
        } else {
            fetch(
                "https://crm-backend-l81t.onrender.com/pipeline",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);

                    fetch(
                        "https://crm-backend-l81t.onrender.com/pipeline"
                    )
                        .then((response) => response.json())
                        .then((pipelineData) => {
                            setDeals(pipelineData);
                        });
                });
        }

        setFormData({
            name: "",
            company: "",
            value: "",
            stage: "Lead",
            owner: ""
        });

        setShowForm(false);
    };

    const handleEdit = (index) => {
        setFormData(deals[index]);
        setEditIndex(index);
        setShowForm(true);
        setError("");
    };

    const handleDelete = (id) => {
        fetch(
            `https://crm-backend-l81t.onrender.com/pipeline/${id}`,
            {
                method: "DELETE"
            }
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                fetch(
                    "https://crm-backend-l81t.onrender.com/pipeline"
                )
                    .then((response) => response.json())
                    .then((pipelineData) => {
                        setDeals(pipelineData);
                    });
            });
    };

    const handleNewDeal = () => {
        setEditIndex(null);

        setFormData({
            name: "",
            company: "",
            value: "",
            stage: "Lead",
            owner: ""
        });

        setError("");
        setShowForm(true);
    };

    const filteredDeals = deals.filter(
        (deal) =>
            deal.name.toLowerCase().includes(search.toLowerCase()) ||
            deal.company.toLowerCase().includes(search.toLowerCase()) ||
            deal.owner.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="pipeline-page">

            <div className="pipeline-page-header">
                <div>
                    <h2>Pipeline</h2>
                    <p>Manage and track your deals</p>
                </div>

                <button onClick={handleNewDeal}>
                    + New Deal
                </button>
            </div>

            <div className="pipeline-stats">

                <div>
                    <h3>Total Deals</h3>
                    <p>{stats.totalDeals}</p>
                </div>

                <div>
                    <h3>Pipeline Value</h3>
                    <p>
                        ₹{Number(stats.pipelineValue).toLocaleString()}
                    </p>
                </div>

                <div>
                    <h3>Closed Won</h3>
                    <p>{stats.closedWon}</p>
                </div>

                <div>
                    <h3>Win Rate</h3>
                    <p>{stats.winRate}%</p>
                </div>

            </div>

            {statsError && (
                <p className="form-error">
                    {statsError}
                </p>
            )}

            <div className="pipeline-table">

                <h3>Deals</h3>

                <input
                    type="text"
                    placeholder="Search deals..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table>
                    <thead>
                        <tr>
                            <th>Deal Name</th>
                            <th>Company</th>
                            <th>Stage</th>
                            <th>Value</th>
                            <th>Owner</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {loading && (
                            <tr>
                                <td colSpan="6">
                                    Loading...
                                </td>
                            </tr>
                        )}

                        {fetchError && (
                            <tr>
                                <td colSpan="6">
                                    {fetchError}
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            !fetchError &&
                            filteredDeals.map((deal) => {
                                const index = deals.indexOf(deal);

                                return (
                                    <tr key={deal.id}>
                                        <td>{deal.name}</td>
                                        <td>{deal.company}</td>
                                        <td>{deal.stage}</td>
                                        <td>₹{deal.value}</td>
                                        <td>{deal.owner}</td>

                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleEdit(index)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(deal.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                    </tbody>
                </table>

                {showForm && (
                    <form
                        className="deal-form"
                        onSubmit={handleSubmit}
                    >

                        {error && (
                            <p className="form-error">
                                {error}
                            </p>
                        )}

                        <input
                            type="text"
                            placeholder="Deal Name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value
                                })
                            }
                        />

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
                            type="text"
                            placeholder="Value"
                            value={formData.value}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    value: e.target.value
                                })
                            }
                        />

                        <select
                            value={formData.stage}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    stage: e.target.value
                                })
                            }
                        >
                            <option>Lead</option>
                            <option>Qualified</option>
                            <option>Demo</option>
                            <option>Proposal</option>
                            <option>Negotiation</option>
                            <option>Closed Won</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Owner"
                            value={formData.owner}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    owner: e.target.value
                                })
                            }
                        />

                        <button type="submit">
                            {editIndex !== null
                                ? "Update Deal"
                                : "Save Deal"}
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

            </div>

        </section>
    );
}

export default PipelinePage;