import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import 'whatwg-fetch';
import Weather from '../src/components/Weather';
import Closet from '../src/Closet';


// Image Upload Tests
describe('Image Upload Feature', () => {
    test('should accept only image file types', () => {
        const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' });
        const handleUploadMock = jest.fn();

        render(
            <div>
                <label htmlFor="file-input">Upload File</label>
                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file && file.type.startsWith('image/')) {
                            handleUploadMock(file);
                        }
                    }}
                />
            </div>
        );

        const input = screen.getByLabelText(/upload file/i);
        fireEvent.change(input, { target: { files: [file] } });
        expect(handleUploadMock).not.toHaveBeenCalled(); // Should not accept non-image files
    });

    test('should allow uploading one file at a time', () => {
        const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
        const handleUploadMock = jest.fn();

        render(
            <div>
                <label htmlFor="file-input">Upload File</label>
                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadMock(e.target.files[0])} // Pass only the first file
                />
            </div>
        );

        const input = screen.getByLabelText(/upload file/i);
        fireEvent.change(input, { target: { files: [file] } });
        expect(handleUploadMock).toHaveBeenCalledWith(file); // Ensure file is handled
    });

});

// Selection Feature Test
describe('Item Selection Feature', () => {
    test('should mark item as selected when clicked', () => {
        const mockSelect = jest.fn();
        const item = { id: 1, name: 'Item 1', selected: false };

        render(
            <div onClick={() => mockSelect(item)}>Item 1</div>
        );

        const div = screen.getByText('Item 1');
        fireEvent.click(div);
        expect(mockSelect).toHaveBeenCalledWith(item);
    });
});

// Weather API Test
describe('Weather API Integration', () => {
    test('should fetch weather data successfully', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    main: { temp: 70, humidity: 50 },
                    wind: { speed: 5 },
                }),
            })
        );

        // Simulate useState mock
        const mockSetTemp = jest.fn();
        const mockSetHumidity = jest.fn();
        const mockSetWindSpeed = jest.fn();

        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => ['', mockSetTemp]) // For temp
            .mockImplementationOnce(() => ['', mockSetHumidity]) // For humidity
            .mockImplementationOnce(() => ['', mockSetWindSpeed]); // For windSpeed

        // Simulate the Weather component's `search` function
        const API_KEY = '95256c102297fc10c26b6bf4ed2e636a';
        const citySearch = 'St. Louis';
        const search = async () => {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=imperial&appid=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            mockSetTemp(data.main.temp);
            mockSetHumidity(data.main.humidity);
            mockSetWindSpeed(data.wind.speed);
        };

        await search();

        expect(mockSetTemp).toHaveBeenCalledWith(70);
        expect(mockSetHumidity).toHaveBeenCalledWith(50);
        expect(mockSetWindSpeed).toHaveBeenCalledWith(5);
    });
});


// Feedback Form Test
describe('Feedback Form', () => {
    test('should submit form with correct data', async () => {
        const handleSubmitMock = jest.fn();
        render(
            <form onSubmit={handleSubmitMock} data-testid="feedback-form">
                <input name="name" defaultValue="John Doe" required />
                <input name="email" defaultValue="john@example.com" required />
                <textarea name="review" defaultValue="Great app!" required />
                <button type="submit">Submit</button>
            </form>
        );

        fireEvent.submit(screen.getByTestId('feedback-form'));
        expect(handleSubmitMock).toHaveBeenCalled();
    });
});
