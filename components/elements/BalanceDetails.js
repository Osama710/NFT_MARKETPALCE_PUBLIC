import { useState } from "react";
const BalanceDetails = (props) => {
    const [open, setOpen] = useState("a1");
    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="total-balance">
                        <p>Total Balance</p>
                        <h2>$221,478</h2>
                    </div>
                </div>
                {props.balances.map((bal, index) => {
                    const balance = parseFloat(`${bal.balance}e-${bal.decimals}`);

                    return (
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6" key={index}>
                        <div
                          className={`${
                            open === "a1"
                              ? "balance-stats active"
                              : "balance-stats"
                          }`}
                          onMouseOver={() => setOpen("a1")}
                        >
                            <p>{bal.name}</p>
                            <h3>{balance > 9999 ? balance.toFixed(0) : balance.toFixed(5)} {bal.symbol}</h3>
                        </div>
                    </div>
                )})}

            </div>
        </>
    );
}

export default BalanceDetails;
