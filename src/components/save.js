 {/* Strengths and Weaknesses */}
 <div className="grid grid-cols-2 gap-6 mb-12">
 <div>
   <h4 className="text-white mb-4">Strengths (Pros)</h4>
   <div className="space-y-3">
     {data.strengths.map((strength, index) => (
       <div key={index} className="bg-black/20 rounded-lg p-3">
         <div className="flex gap-3">
           <span className="text-green-500">+</span>
           <p className="text-gray-300">{strength}</p>
         </div>
       </div>
     ))}
   </div>
 </div>
 <div>
   <h4 className="text-white mb-4">Weaknesses (Cons)</h4>
   <div className="space-y-3">
     {data.weaknesses.map((weakness, index) => (
       <div key={index} className="bg-black/20 rounded-lg p-3">
         <div className="flex gap-3">
           <span className="text-red-500">-</span>
           <p className="text-gray-300">{weakness}</p>
         </div>
       </div>
     ))}
   </div>
 </div>
</div>

{/* Expert Opinions */}
<div className="mb-12">
 <h3 className="text-white text-lg mb-6">Expert Opinions</h3>
 <div className="grid grid-cols-1 gap-6">
   {data.expert_opinions.map((opinion, index) => (
     <div key={index} className="bg-black/20 rounded-lg p-6">
       <p className="text-gray-300">{opinion}</p>
     </div>
   ))}
 </div>
</div>

{/* Final Verdict */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
 <div>
   <h3 className="text-white text-lg mb-6">Final Verdict</h3>
   <div className="space-y-4">
     {Object.entries(data.final_verdict).map(([key, value]) => (
       <div key={key} className="flex justify-between items-center">
         <p className="text-gray-300">{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
         <div className="flex items-center gap-2">
           <div className="w-32 h-2 bg-black/20 rounded-full overflow-hidden">
             <div
               className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
               style={{ width: `${(value as number) * 10}%` }}
             />
           </div>
           <span className="text-white min-w-[2.5rem] text-right">{value}/10</span>
         </div>
       </div>
     ))}
   </div>
 </div>
 <div>
   <h3 className="text-white text-lg mb-6">Performance Analysis</h3>
   <div className="h-[400px]">
     <RadarChart data={data.final_verdict} />
   </div>
 </div>
</div>

{/* Download PDF Button */}
<div className="mt-8 flex justify-center gap-4">
 <PDFDownloadLink
   document={<PitchDeckPDF data={data} />}
   fileName={`pitch-deck-analysis-${format(data.analyzedAt, 'yyyy-MM-dd')}.pdf`}
 >
   {({ loading }) => (
     <button
       className={`${
         loading ? 'bg-gray-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
       } text-white px-6 py-2 rounded-lg flex items-center gap-2`}
       disabled={loading}
     >
       <FileText className="w-5 h-5" />
       {loading ? 'Generating PDF...' : 'Download PDF Report'}
     </button>
   )}
 </PDFDownloadLink>
</div>
</div>

{/* Download and History Buttons */}
<div className="mt-8 flex justify-center gap-4">
<button
 onClick={() => setShowHistory(true)}
 className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg flex items-center gap-2"
>
 <HistoryIcon className="w-4 h-4" />
 View History
</button>