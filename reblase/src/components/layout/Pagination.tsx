import React, { ReactNode, useContext, useEffect, useState } from "react";

/**
 * Create a range of numbers
 * @private
 * @param {number} maxNumber - Maximum number of the range, inclusive
 * @param {number} [minNumber=1] - Minimum number of the range, inclusive
 * @returns {number[]} The generated range
 */
function _range(maxNumber: number, minNumber = 1): number[] {
    const range = [];
    for (let i = Math.max(0, minNumber); i <= maxNumber; i++) {
        range.push(i);
    }
    return range;
}

/**
 * Interface to be used for PageContexts
 * @interface
 */
interface Paginator {
    currentPage: number,
    setCurrentPage?: any,
    itemsPerPage: number,
    setItemsPerPage?: any,
    totalPages: number,
    setTotalPages?: any,
}

/**
 * Default value of PageContext, used if no other context is provided
 * @implements Paginator
 */
const DefaultPaginator: Paginator = {
    currentPage: 0,
    itemsPerPage: 0,
    totalPages: 1,
};
// Create PageContext, setting default value to DefaultPaginator
const PageContext = React.createContext(DefaultPaginator);

/**
 * Type declaration of all possible variants of pagination buttons
 * @type PageButtonVariant
 */
type PageButtonVariant = "first" | "prev" | "next" | "last" | "collapse" | "number"

/**
 * PageButton component, to be used as part of a nav bar or button grouping for page navigation
 * @param {Object} props - Config options for this component
 * @param {PageButtonVariant} props.variant - The desired variant to use to display this button
 * @param {number} [props.pageNumber] - The number to display within a number button
 * @returns {JSX.Element} - The PageButton React component
 */
function PageButton({ variant, pageNumber }: { variant: PageButtonVariant, pageNumber?: number }): JSX.Element {
    const [FIRST_PAGE, PREVIOUS_PAGE, NEXT_PAGE, LAST_PAGE] = ["\u{00AB}", "\u{2039}", "\u{0203A}", "\u{00BB}"];
    const Paginator = useContext(PageContext);

    // The following functions exist in lazy try-catch blocks so that if their respective methods are not properly set when using this, they will be rouse the implementer to do something about it. (Hopefully :) )
    function goToFirstPage(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        try {
            Paginator.setCurrentPage(0);
        } catch (err) {
            console.error(err);
        }
    }

    function goToPrevPage(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        try {
            Paginator.setCurrentPage(Paginator.currentPage > 0 ? Paginator.currentPage - 1 : 0);
        } catch (err) {
            console.error(err);
        }
    }

    function goToPage(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        try {
            Paginator.setCurrentPage(parseInt(event.currentTarget.value));
        } catch (err) {
            console.error(err);
        }
    }

    function goToNextPage(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (Paginator.totalPages) {
            try {
                Paginator.setCurrentPage(Paginator.currentPage + 1 < Paginator.totalPages ? Paginator.currentPage + 1 : Paginator.currentPage);
            } catch (err) {
                console.error(err);
            }
        }
    }

    function goToLastPage(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (Paginator.totalPages > 0) {
            try {
                Paginator.setCurrentPage(Paginator.totalPages - 1);
            } catch (err) {
                console.error(err);
            }
        }
    }

    switch (variant) {
        case "first":
            return <button
                className="page-btn rounded-l-md hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                aria-label="First page" onClick={goToFirstPage}>{FIRST_PAGE}</button>;
        case "prev":
            return <button
                className="page-btn hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                aria-label="Previous page" onClick={goToPrevPage}>{PREVIOUS_PAGE}</button>;
        case "collapse":
            return <div className="cursor-default page-btn">...</div>;
        case "next":
            return <button
                className="page-btn hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                aria-label="Next page" onClick={goToNextPage}>{NEXT_PAGE}</button>;
        case "last":
            return <button
                className="page-btn rounded-r-md hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                aria-label="Last page" onClick={goToLastPage}>{LAST_PAGE}</button>;
        case "number":
            if (pageNumber !== undefined) {
                return <button
                    className={`page-btn hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black ${Paginator.currentPage === pageNumber ? "bg-gray-500 text-black" : null}`}
                    onClick={goToPage}
                    value={pageNumber}>{pageNumber + 1}</button>;
            } else {
                return <div className="cursor-default page-btn">...</div>;
            }
    }
}

type PageNavConfig = {
    buttonLimit?: number,
    specialButtons?: PageButtonVariant[],
    className?: string
}

/**
 * Generates a PageNav button grouping consisting of {@link PageButton}s
 * @example
 * // Creates 5 buttons, with additional first and last buttons
 * <PageNav buttonLimit=5 specialButtons={['first', 'last']}/>
 * @param {Object} props - Config options for this component
 * @param {number} [props.buttonLimit=3] The maximum amount of numbered buttons to show at any time. If set to an even number, the maximum will be n+1, rather than n, when not near the edge of the list of pages.
 * @param {PageButtonVariant[]} [props.specialButtons=['first', 'prev', 'next', 'last', 'collapse', 'number']] An array of the desired special button variants to include, defaulting to include all variants
 * @param {string} [props.className] Optional styling via React's className property
 * @returns {JSX.Element} The PageNav React component, except in cases where there are no valid pages to navigate
 */
function PageNav({
                     buttonLimit = 3,
                     specialButtons = ["first", "prev", "next", "last", "collapse", "number"],
                     className,
                 }: PageNavConfig) {

    // useContext to get totalPages and itemsPerPage
    const Paginator = useContext(PageContext);

    // Create button group, displaying special buttons as appropriate
    const pageButtons = [];
    pageButtons.push(
        specialButtons.includes("first") ? <PageButton variant="first" key="pageFirst" /> : null,
        specialButtons.includes("prev") ? <PageButton variant="prev" key="pagePrev" /> : null);
    // If there are more pages than the limit before the current page, indicate that there was a collapse
    if (Paginator.totalPages > buttonLimit && Paginator.currentPage >= Paginator.totalPages / 2) {
        pageButtons.push(specialButtons.includes("collapse") ?
            <PageButton variant="collapse" key="pageCollapseBefore" /> : null);
    }
    // Display up to buttonLimit or totalPages, whichever is smaller
    // Attempt to split the buttonLimit, as evenly as possible, across the current page number. If not possible, throw it to one side, biasing for the current page as an edge
    // NOTE: Even numbers can't be split and also have a "center", so even buttonLimit values will actually render as buttonLimit+1 when there is no edge bias
    for (let page = Math.max(0, Math.min(Paginator.totalPages - buttonLimit, Paginator.currentPage - Math.floor(buttonLimit / 2))); page < Math.min(Paginator.totalPages, Math.max(buttonLimit, Paginator.currentPage + 1 + Math.floor(buttonLimit / 2))); page++) {
        pageButtons.push(<PageButton variant="number" pageNumber={page} key={`page-${page}`} />);
    }
    // If there are more pages than the limit after the current page, indicate that there was a collapse
    if (Paginator.totalPages > buttonLimit && Paginator.currentPage <= Paginator.totalPages / 2) {
        pageButtons.push(specialButtons.includes("collapse") ?
            <PageButton variant="collapse" key="pageCollapseAfter" /> : null);
    }
    pageButtons.push(
        specialButtons.includes("next") ? <PageButton variant="next" key="pageNext" /> : null,
        specialButtons.includes("last") ? <PageButton variant="last" key="pageLast" /> : null,
    );

    return (
        Paginator.totalPages !== 0 ?
            <nav className={`flex flex-row justify-center my-2 max-w-full ${className}`}>{pageButtons}</nav> : null
    );
}

type PageSizerConfig = {
    itemsPerPageValues: number[],
    className?: string
}

/**
 * Select element allowing user to change how many items are listed per page
 * @param {Object} props - Config options for this component
 * @param {number[]} props.itemsPerPageValues - The options to be presented to the user; 'All' will be appended to the list, allowing users to decline pagination
 * @param {string} [props.className] - Optional styling via React's className property
 * @returns {JSX.Element} - The PageSizer component
 */
function PageSizer({ itemsPerPageValues, className }: PageSizerConfig) {
    // Append the list of options for the selector with "All", making sure that the options are first sorted numerically
    const [itemsPerPageChoices, setItemsPerPageChoices] = useState([...itemsPerPageValues.sort((a, b) => a - b), "All"]);
    // If the prop fed into this changes, sort again, then append again
    useEffect(() => {
        setItemsPerPageChoices([...itemsPerPageValues.sort((a, b) => a - b), "All"]);
    }, [itemsPerPageValues]);

    const Paginator = useContext(PageContext);

    return (
        <label className={`my-2 ${className}`}>Events per page: <select className="px-0.5 bg-white text-black"
                                                                        value={Paginator.itemsPerPage}
                                                                        onChange={(event) => {
                                                                            Paginator.setCurrentPage(0);
                                                                            Paginator.setItemsPerPage(parseInt(event.currentTarget.value));
                                                                        }}>
            {itemsPerPageChoices.map((choice) => {
                return <option key={`perPage-${choice}`}
                               value={choice === "All" ? 0 : choice}>{choice}</option>;
            })}
        </select>
        </label>
    );
}

type PageJumpConfig = {
    className?: string
}

/**
 * Select element allowing user to jump to a specific page. The options are automatically generated using the {@link _range} function.
 * @param {Object} props - Config options for this component
 * @param {string} [props.className] - Optional styling via React's className property
 * @returns The PageJump component
 */
function PageJump({ className }: PageJumpConfig) {
    const Paginator = useContext(PageContext);
    const [pageRange] = useState(_range(Paginator.totalPages));

    return (
        Paginator.totalPages !== 0 ?
            <label className={`my-2 ${className}`}>Jump to: <select className="px-0.5 bg-white text-black"
                                                                    value={Paginator.currentPage}
                                                                    onChange={(event) => {
                                                                        Paginator.setCurrentPage(parseInt(event.currentTarget.value));
                                                                    }}>
                {pageRange.map((choice) => {
                    return <option key={`jump-${choice}`} value={choice - 1}>{choice}</option>;
                })}
            </select>
            </label>
            : null
    );
}

/**
 * Type used to restrict or control placement of pagination utilities
 * @type DisplayOption
 */
type DisplayOption = boolean | "top" | "bottom";

/**
 * The main Pagination element, which creates paginated content based on its {@link React.Children}
 * @param {Object} props - Config options for this component
 * @param {DisplayOption} [props.pageNavDisplay] - Toggles where, if at all, {@link PageNav} is placed relative to the paginated content
 * @param {PageNavConfig} [props.pageNavConfig] - {@link PageNavConfig} object, used to inject custom config to {@link PageNav}
 * @param {DisplayOption} [props.pageSizerDisplay] - Toggles where, if at all, {@link PageSizer} is placed relative to the paginated content
 * @param {PageSizerConfig} [props.pageSizerConfig] - {@link PageSizerConfig} object, used to inject custom config to {@link PageSizer}
 * @param {DisplayOption} [props.pageJumpDisplay] - Toggles where, if at all, {@link PageJump} is placed relative to the paginated content
 * @param {PageJumpConfig} [props.pageJumpConfig] - {@link PageJumpConfig} object, used to inject custom config to {@link PageJump}
 * @param {number} [props.defaultItemsPerPage=10] - The default number of items to display per page
 * @param {React.Children} [props.children] - The children of this component from the JSX hierarchy
 * @param {className} [props.className] - Optional styling via React's className property
 * @return {JSX.Element} The Pagination React component
 */
export function Pagination({
                               pageNavDisplay = true,
                               pageNavConfig,
                               pageSizerDisplay = true,
                               pageSizerConfig = { itemsPerPageValues: [10, 25, 50, 100] },
                               pageJumpDisplay = true,
                               pageJumpConfig,
                               defaultItemsPerPage = 10,
                               children,
                               className,
                           }: { pageNavDisplay?: DisplayOption, pageNavConfig?: PageNavConfig, pageSizerDisplay?: DisplayOption, pageSizerConfig?: PageSizerConfig, pageJumpDisplay?: DisplayOption, pageJumpConfig?: PageJumpConfig, defaultItemsPerPage?: number, children: ReactNode, className?: string }) {
    const [totalItems] = useState(React.Children.count(children));
    const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
    // If defaultItemsPerPage or itemsPerPage are 0, this indicates that 'All' items are selected/user has declined pagination
    // Set totalPages to 0 to reflect this
    const [totalPages, setTotalPages] = useState(defaultItemsPerPage === 0 ? 0 : Math.ceil(totalItems / defaultItemsPerPage));
    // If the totalItems or itemsPerPage ever change, the number of totalPages needs to be reset according to those values
    useEffect(() => {
        setTotalPages(itemsPerPage === 0 ? 0 : Math.ceil(totalItems / itemsPerPage));
    }, [itemsPerPage, totalItems]);
    const [currentPage, setCurrentPage] = useState(0);
    const Paginator: Paginator = {
        currentPage: currentPage,
        setCurrentPage: (pageNumber: number) => {
            setCurrentPage(pageNumber);
        },
        itemsPerPage: itemsPerPage,
        setItemsPerPage: (itemsPerPage: number) => {
            setItemsPerPage(itemsPerPage);
        },
        totalPages: totalPages,
    };

    /**
     * Utility function for populating the pagination elements, used to help maintain some DRYness. This has a default responsive styling that cannot be overwritten at this time; perhaps this could be improved!
     * @private
     * @param {'top'|'bottom'} position - Where this element should be placed relative to the paginated content
     * @returns {JSX.Element} - A grouping of {@link PageSizer}, {@link PageNav}, and {@link PageJump}. Each elements visibility will be affected by the related options as set in {@link Pagination}.
     */
    function _PageUtilities({ position }: { position: "top" | "bottom" }) {
        let oppositePosition = position === "top" ? "bottom" : "top";
        return (
            <div
                className="grid grid-flow-row-dense sm:grid-flow-row grid-cols-5 sm:grid-cols-3 grid-rows-2 sm:grid-rows-1 place-items-center">
                {(pageSizerDisplay !== oppositePosition && pageSizerDisplay) ?
                    <PageSizer
                        className="row-start-2 row-span-1 col-start-1 col-span-3 -ml-2 sm:ml-0 sm:row-start-1 sm:col-span-1" {...pageSizerConfig} /> : null
                }
                {(pageNavDisplay !== oppositePosition && pageNavDisplay) ?
                    <PageNav
                        className="row-start-1 col-start-2 col-span-3 sm:col-start-2 sm:col-span-1" {...pageNavConfig} /> : null
                }
                {(pageJumpDisplay !== oppositePosition && pageJumpDisplay) ?
                    <PageJump
                        className="row-start-2 row-span-1 col-start-4 col-span-2 -mr-2 sm:mr-0 sm:row-start-1 sm:col-span-1" {...pageJumpConfig} /> : null
                }
            </div>
        );
    }

    return (
        <PageContext.Provider value={Paginator}>
            <_PageUtilities position="top" />
            <div className={`flex flex-col ${className}`}>
                {
                    React.Children.toArray(children).map((child, index) => {
                        // If 'All' is selected, display all children
                        if (Paginator.itemsPerPage === 0) {
                            return child;
                        } else {
                            // If any other number of items per page are selected, display only those that fall within the page bounds
                            if (((Paginator.currentPage * Paginator.itemsPerPage) <= index) && (index < ((Paginator.currentPage * Paginator.itemsPerPage) + Paginator.itemsPerPage))) {
                                return child;
                            } else {
                                return null;
                            }
                        }
                    })
                }
            </div>
            <_PageUtilities position="bottom" />
        </PageContext.Provider>
    );
}