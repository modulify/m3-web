import {
    describe,
    expect,
    test,
} from 'vitest'

import { fireEvent, render } from '@testing-library/react'

import React, { useState } from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

describe('m3-react/button', () => {
    test('text node is wrapped', () => {
        const { container } = render(
            <M3Button>
                Some text
            </M3Button>
        )

        const text = container.querySelector('.m3-button__text')

        expect(text).not.toBeNull()
        expect(text.innerHTML).toEqual('Some text')
    })

    test('svg node is wrapped', () => {
        const { container } = render(
            <M3Button>
                <M3Icon name={'edit'} />
            </M3Button>
        )
    
        const icon = container.querySelector('.m3-button__icon > .m3-icon')
    
        expect(icon).not.toBeNull()
        expect(icon.innerHTML).toEqual('edit')
    })
    
    test('icon and text node is wrapped', () => {
        const { container } = render(
            <M3Button>
                <M3Icon name={'edit'} />
                Some text
            </M3Button>
        )
    
        const icon = container.querySelector('.m3-button__icon > .m3-icon')
    
        expect(icon).not.toBeNull()
        expect(icon.innerHTML).toEqual('edit')
    
        const text = container.querySelector('.m3-button__text')
    
        expect(text).not.toBeNull()
        expect(text.innerHTML.trim()).toEqual('Some text')
    })

    test.each([
        'b',
        'i',
        'span',
        'strong',
    ])('%s node is wrapped', (tag) => {
        const { container } = render(
            <M3Button>
                { React.createElement(tag, null, 'Some text') }  
            </M3Button>
        )

        const text = container.querySelector(`.m3-button__text ${tag}`)

        expect(text).not.toBeNull()
        expect(text.innerHTML.trim()).toEqual('Some text')
    })

    test('dynamic text content is wrapped', () => {
        function ButtonContainer () {
            const [iconActive, setIconActive ] = useState(true)

            const switchIconActive = () => {
                setIconActive(prevState => !prevState)
            }
            
            return (
                <M3Button onClick={switchIconActive}>
                    { iconActive ? <M3Icon name={'edit'} /> : 'Some text' }
                </M3Button>
            )
        }

        const { container } = render(<ButtonContainer />)
 
        const icon = container.querySelector('.m3-button__icon > .m3-icon')
    
        expect(icon).not.toBeNull()
        expect(icon.innerHTML).toEqual('edit')

        fireEvent.click(container.querySelector('.m3-button'))
    
        const text = container.querySelector('.m3-button__text')
    
        expect(text).not.toBeNull()
        expect(text.innerHTML).toEqual('Some text')
    })

    test('reactive changing content in slots', async () => {
        function ButtonContainer () {
            const [iconActive, setIconActive ] = useState(true)

            const switchIconActive = () => {
                setIconActive(prevState => !prevState)
            }
            
            return (
                <M3Button onClick={switchIconActive}>
                    {
                        iconActive
                        ? [<M3Icon name={'edit'} />, 'Some text' ]
                        : 'Some text'
                    }
                </M3Button>
            )
        }

        const { container } = render(<ButtonContainer />)
    
        const contentBefore = container.querySelector('.m3-button__content')
    
        expect(contentBefore.childElementCount).toEqual(2)
   
        const icon = container.querySelector('.m3-icon')

        expect(icon).not.toBeNull()
        expect(icon.innerHTML).toEqual('edit')

        expect(contentBefore.lastChild.textContent).toEqual('Some text')

        fireEvent.click(container.querySelector('.m3-button'))

        const contentAfter = container.querySelector('.m3-button__content')

        expect(contentAfter.childElementCount).toEqual(1)

        expect(contentAfter.firstChild.textContent).toEqual('Some text')
    })
})