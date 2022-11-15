import Head from "next/head";
function PageHead({headTitle}) {
    return (
        <>
            <Head>
            <title>
            {headTitle ? headTitle : "NFT - Dashboard React App"}
            </title>
            <link  rel="icon" href="/images/favicon.ico" />
        </Head>
        </>
    );
}
export default PageHead;
