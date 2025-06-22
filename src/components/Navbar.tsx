import {Link, NavLink} from "react-router-dom";
import React from "react";
import {
    pathCreateEvents,
    pathHome, pathLogin,
} from "../routers/Paths.tsx";
import {logout} from "../services/token.tsx";

interface NavigationItemProps {
    label: string;
    path: string;
    onClick?: () => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ label, path, onClick }) => {
    return (
        <li>
            <NavLink
                to={path}
                onClick={onClick}
                className={({ isActive }) =>
                    `gap-2 self-stretch p-2 my-auto rounded-lg ${
                        isActive ? 'bg-neutral-100 text-[color:var(--sds-color-text-brand-on-brand-secondary)]' : ''
                    }`
                }
            >
                {label}
            </NavLink>
        </li>
    );
}
const handleLogout = () => {
    logout()
}

function Navbar() {

    const navigationItems = [
        { label: 'Criar evento', path: pathCreateEvents },
        { label: 'Sair', path: pathLogin }
    ];

    return (
        <nav className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-8 items-center p-4 mb-0 mx-auto w-full bg-white border-b border-zinc-300 sm:px-5 overflow-hidden">
            <div className="flex justify-start">
                <Link to={pathHome}>
                    <h1 className="mt-2 text-gray-800 mb-2 font-bold text-lg">Event
                        <span className="bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent">Sync</span>
                    </h1>
                </Link>
            </div>
            <ul className="flex flex-wrap gap-6 sm:gap-8 sm:flex-row">
                {navigationItems.map((item, index) => (
                    <NavigationItem
                        key={index}
                        label={item.label}
                        path={item.path}
                        onClick={item.label === 'Sair' ? handleLogout : undefined}
                    />
                ))}
            </ul>
        </nav>
    );
}

export default Navbar;