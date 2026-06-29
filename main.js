document.addEventListener("DOMContentLoaded", () => {
    // 1. DYNAMIC WEEKEND DATES GENERATION
    function getUpcomingWeekend() {
        const today = new Date();
        const nextSat = new Date();
        const nextSun = new Date();

        const daysToSaturday = (6 - today.getDay() + 7) % 7;
        const targetDaysToSat = daysToSaturday === 0 ? 7 : daysToSaturday;

        nextSat.setDate(today.getDate() + targetDaysToSat);
        nextSun.setDate(nextSat.getDate() + 1);

        const options = { day: 'numeric' };
        const satDay = nextSat.toLocaleDateString('en-IN', options);
        const sunDay = nextSun.toLocaleDateString('en-IN', options);
        const month = nextSat.toLocaleDateString('en-IN', { month: 'short' });

        function getOrdinalSuffix(day) {
            const d = parseInt(day);
            if (d > 3 && d < 21) return 'th';
            switch (d % 10) {
                case 1:  return "st";
                case 2:  return "nd";
                case 3:  return "rd";
                default: return "th";
            }
        }

        const dateString = `${satDay}${getOrdinalSuffix(satDay)} & ${sunDay}${getOrdinalSuffix(sunDay)} ${month}`;
        const dateElement = document.getElementById("live-date");
        if (dateElement) {
            dateElement.textContent = dateString;
        }
    }

    getUpcomingWeekend();

    // 2. ROLLING COUNTDOWN TIMER starting exactly at 12:18
    let totalSeconds = 12 * 60 + 18; // 12 minutes 18 seconds
    
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function updateCountdown() {
        if (totalSeconds <= 0) {
            // Reset back to 12 mins 18 secs to keep the urgency rolling
            totalSeconds = 12 * 60 + 18;
        }

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const formattedMins = String(minutes).padStart(2, '0');
        const formattedSecs = String(seconds).padStart(2, '0');

        if (minutesEl && secondsEl) {
            minutesEl.textContent = formattedMins;
            secondsEl.textContent = formattedSecs;
        }

        const stickyTimerEl = document.getElementById("sticky-timer-lbl");
        if (stickyTimerEl) {
            stickyTimerEl.textContent = `${formattedMins}:${formattedSecs}`;
        }

        const checkoutTimerEl = document.getElementById("checkout-timer-lbl");
        if (checkoutTimerEl) {
            checkoutTimerEl.textContent = `${formattedMins}:${formattedSecs}`;
        }

        totalSeconds--;
    }

    // Run immediately and then start interval
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 3. INTERACTIVE DIAGNOSTIC QUIZ LOGIC
    const checkboxes = document.querySelectorAll(".quiz-checkbox");
    const gapCountElement = document.getElementById("gap-count");

    function updateQuizGaps() {
        let checkedCount = 0;
        checkboxes.forEach(cb => {
            if (cb.checked) checkedCount++;
        });
        if (gapCountElement) {
            gapCountElement.textContent = checkedCount;
        }
    }

    checkboxes.forEach(cb => {
        cb.addEventListener("change", updateQuizGaps);
    });

    // 4. TIMELINE SCROLL PROGRESS & FADE ANIMATION
    const timelineWrapper = document.querySelector(".timeline-wrapper");
    const progressLine = document.getElementById("timeline-progress");
    const timelineItems = document.querySelectorAll(".timeline-item");

    function handleTimelineScroll() {
        if (!timelineWrapper || !progressLine) return;

        const rect = timelineWrapper.getBoundingClientRect();
        const wrapperTop = rect.top + window.scrollY;
        const wrapperHeight = rect.height;
        const viewportHeight = window.innerHeight;

        // Calculate progress percentage based on scroll position inside the wrapper
        // Start drawing when the top of the wrapper enters the center of the viewport
        const triggerPoint = window.scrollY + (viewportHeight * 0.6);
        const progressStart = wrapperTop;
        const progressEnd = wrapperTop + wrapperHeight;

        let percentage = 0;
        if (triggerPoint > progressStart) {
            percentage = ((triggerPoint - progressStart) / (progressEnd - progressStart)) * 100;
            percentage = Math.min(100, Math.max(0, percentage));
        }

        progressLine.style.height = `${percentage}%`;

        // Check each dot and card state
        timelineItems.forEach((item, index) => {
            const dot = item.querySelector(".timeline-dot");
            const card = item.querySelector(".timeline-card");
            if (!dot || !card) return;

            const itemRect = item.getBoundingClientRect();
            const itemTop = itemRect.top + window.scrollY;

            // Trigger active state when scroll trigger reaches the item's vertical level
            if (triggerPoint > itemTop + 24) {
                dot.classList.add("active");
                card.classList.add("visible");
            } else {
                dot.classList.remove("active");
                card.classList.remove("visible");
            }
        });
    }

    // Bind scroll and load listeners
    window.addEventListener("scroll", handleTimelineScroll);
    window.addEventListener("resize", handleTimelineScroll);
    // Trigger once on startup to render initial visible items
    setTimeout(handleTimelineScroll, 200);

    // 6. FAQ ACCORDION HANDLERS
    const faqHeaders = document.querySelectorAll(".faq-header");
    faqHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const isActive = item.classList.contains("active");

            // Close all open accordion items first
            document.querySelectorAll(".faq-item").forEach(el => {
                el.classList.remove("active");
                const btn = el.querySelector(".faq-header");
                if (btn) btn.setAttribute("aria-expanded", "false");
            });

            // If it wasn't already active, open it
            if (!isActive) {
                item.classList.add("active");
                header.setAttribute("aria-expanded", "true");
            }
        });
    });
});
