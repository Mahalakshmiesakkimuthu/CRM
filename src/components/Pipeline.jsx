
import { useState, useEffect } from "react";

function Pipeline() {
    const [deals, setDeals] = useState([]);

    useEffect(() => {
        fetch("https://crm-backend-l81t.onrender.com/pipeline")
            .then((response) => response.json())
            .then((data) => {
                setDeals(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const stages = [
        { name: "Qualified", className: "qualified" },
        { name: "Demo", className: "demo" },
        { name: "Proposal", className: "proposal" },
        { name: "Negotiation", className: "negotiation" },
        { name: "Closed Won", className: "closed" }
    ];

    const totalValue = deals.reduce(
        (total, deal) => total + Number(deal.value),
        0
    );

    return (
        <section className="pipeline">

            <div className="section-title">
                <h3>Pipeline by Stage</h3>
                <span>
                    Total ₹{totalValue.toLocaleString()}
                </span>
            </div>

            {stages.map((stage) => {
                const stageDeals = deals.filter(
                    (deal) => deal.stage === stage.name
                );

                const stageValue = stageDeals.reduce(
                    (total, deal) => total + Number(deal.value),
                    0
                );

                const percentage =
                    totalValue > 0
                        ? (stageValue / totalValue) * 100
                        : 0;

                return (
                    <div className="pipeline-row" key={stage.name}>

                        <span>{stage.name}</span>

                        <div className="bar">
                            <div
                                className={`fill ${stage.className}`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>

                        <small>{stageDeals.length}</small>

                        <b>
                            ₹{stageValue.toLocaleString()}
                        </b>

                    </div>
                );
            })}

        </section>
    );
}

export default Pipeline;
