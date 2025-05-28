import React from "react";
import ToggleTheme from "./toggleTheme";

const Header = () => {
	return (
		<header className="flex justify-end">
			<ToggleTheme />
		</header>
	);
};

export default Header;
