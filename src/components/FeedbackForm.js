import React, {useState, useEffect} from "react";
import './FeedbackForm.css'

const FeedbackForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const feedbackData = { name, email, review, rating };

        try {
            const response = await fetch('http://localhost:5001/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedbackData),
            });

            if (response.ok) {
                setMessage('Thank you for your feedback!');
                setName('');
                setEmail('');
                setReview('');
                setRating(0);
            } else {
                setMessage('There was an issue submitting your feedback. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setMessage('There was an issue submitting your feedback. Please try again.');
        }
    };

    return (
        <div className="feedback-form">
            <h2>Feedback</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Write your review here..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                />
                <label>
                    Rating:
                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        required
                    >
                        <option value={0} disabled>
                            Select rating
                        </option>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star}>
                                {star} Star{star > 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FeedbackForm;
