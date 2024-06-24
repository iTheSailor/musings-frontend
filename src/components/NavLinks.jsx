import React from 'react'
import {
  DropdownMenu,
  DropdownItem,
  DropdownHeader,
  DropdownDivider,
  MenuItem,
  Dropdown,

} from 'semantic-ui-react'

const NavDropdown = () => (
<>
    <MenuItem className='link item' href='/'>Home</MenuItem>
    <Dropdown text='Apps' pointing className='link item'>
      <DropdownMenu>
        <DropdownHeader>Apps</DropdownHeader>
        <DropdownItem href='/apps/forecast'>Forecast</DropdownItem>
        <DropdownItem href='/apps/sudoku'>Sudoku</DropdownItem>
        <DropdownItem href='/apps/todo'>To-Do List</DropdownItem>
        <DropdownItem href='/apps/finance'>Finance</DropdownItem>
        <DropdownDivider />
        <DropdownHeader>Docs</DropdownHeader>
        <DropdownItem>Forecast</DropdownItem>
        <DropdownItem>Sudoku</DropdownItem>
        <DropdownItem>To-Do List</DropdownItem>
        <DropdownItem>Finance</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <MenuItem className='link item' href='/portfolio'>Portfolio</MenuItem>
    <MenuItem className='link item' href='/contact'>Contact Me</MenuItem>
    </>
)

export default NavDropdown
