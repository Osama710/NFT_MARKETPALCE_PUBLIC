import AdminSection from "../components/form/AdminSection";
import Layout from "../components/layout/Layout";
import SettingsMenu from "./../components/layout/SettingsMenu";
function SettingsPreferences() {
    return (
        <>
            <Layout
                 headTitle="Application"
                 pageTitle="Application"
                 pageTitleSub={"Welcome NFT Settings Application page"}
                 pageClass={"dashboard"}
                 parent={"Settings"}
                 child={"Application"}
            >
                <SettingsMenu />

                <div className="row">
                    <div className="col-xxl-12">
                        <div className="card">
                            <div className="card-body bg-transparent">
                                <AdminSection/>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
export default SettingsPreferences;
