import React from 'react';
import Link from 'next/link';

const PageTitle = ({ pageTitle, pageTitleSub, parentEl, childEl }) => {
    return (
        <>
            <div className="page-title">
                <div className="row align-items-center justify-content-between">
                    <div className="col-6">
                        <div className="page-title-content">
                            <h3>{pageTitle}</h3>
                            <p className="mb-2">{pageTitleSub}</p>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="breadcrumbs">
                            <Link href="/">{parentEl}</Link>
                            <span>
                                <i className="ri-arrow-right-s-line"></i>
                            </span>
                            <Link href={`/${childEl.toLowerCase()}`}>{childEl}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default PageTitle;
