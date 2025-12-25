async function handleDownload() {
    // DOM Elements
    const input = document.getElementById('urlInput');
    const button = document.getElementById('downloadBtn');
    const resultContainer = document.getElementById('resultContainer') || createResultContainer();
    const url = input.value.trim();

    // Reset previous results
    resultContainer.innerHTML = '';
    resultContainer.classList.add('hidden');

    // Basic Validation
    if (!url) {
        alert('الرجاء إدخال رابط فيديو تيك توك صحيح!');
        input.focus();
        input.classList.add('ring-4', 'ring-red-400');
        setTimeout(() => input.classList.remove('ring-4', 'ring-red-400'), 2000);
        return;
    }

    // Button Loading State
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `
        <svg class="animate-spin h-6 w-6 text-white ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        جاري المعالجة...
    `;

    try {
        const response = await fetch('/api/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (data.success) {
            // Show Result Card
            showResult(data.data);
            button.innerHTML = 'تم التحميل!';
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 2000);
        } else {
            throw new Error(data.error || 'فشل التحميل');
        }

    } catch (error) {
        alert('حدث خطأ: ' + error.message);
        button.innerHTML = originalText;
        button.disabled = false;
    }


}

function createResultContainer() {
    const main = document.querySelector('main');
    const container = document.createElement('div');
    container.id = 'resultContainer';
    container.className = 'w-full mt-6 hidden transition-all duration-500 ease-in-out';
    // Insert before the bottom ad space (last-child is footer, so before that or specific ad)
    // Let's insert it after the buttons row for now
    const inputRow = document.querySelector('.flex.flex-col.md\\:flex-row'); // The input row
    inputRow.parentNode.insertBefore(container, inputRow.nextSibling);
    return container;
}

function showResult(video) {
    const container = document.getElementById('resultContainer');
    container.classList.remove('hidden');
    container.innerHTML = `
        <div class="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 animate-fade-in-up">
            <div class="flex flex-col md:flex-row gap-6 items-center">
                <!-- Thumbnail -->
                <div class="relative w-full md:w-1/3 aspect-[9/16] md:aspect-square rounded-2xl overflow-hidden shadow-lg group">
                    <img src="${video.cover}" alt="Video Thumbnail" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
                </div>
                
                <!-- Info & Download -->
                <div class="flex-1 text-right w-full">
                    <h3 class="font-bold text-xl mb-2 text-gray-800 line-clamp-2">${video.title}</h3>
                    <div class="flex items-center gap-2 mb-6 text-gray-600">
                        <span class="bg-white/60 px-3 py-1 rounded-full text-sm">👤 ${video.author}</span>
                    </div>

                    <div class="flex flex-col gap-3">
                        <a href="${video.videoUrl}" target="_blank" download="tiktok_video.mp4" 
                           class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition transform hover:-translate-y-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            تحميل الفيديو (بدون علامة)
                        </a>
                        
                        ${video.musicUrl ? `
                        <a href="${video.musicUrl}" target="_blank" download="audio.mp3"
                           class="w-full bg-white/50 hover:bg-white/70 text-gray-800 font-bold py-3 px-6 rounded-xl shadow border border-white/60 flex items-center justify-center gap-2 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            تحميل الصوت فقط
                        </a>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}


