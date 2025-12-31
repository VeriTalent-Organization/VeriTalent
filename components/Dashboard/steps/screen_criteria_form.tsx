import React, { useState, ChangeEvent } from 'react';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Text } from '@/components/reuseables/text';
import type { ScreeningCriteriaDto } from '@/types/create_job';

type CriteriaKey = 'Culture' | 'Experience' | 'Education' | 'Location' | 'Salary' | 'Skills' | 'Others';

export default function ScreeningCriteriaForm({ onNext, onBack, onDataChange }: 
  { 
    onNext?: () => void; onBack?: () => void; 
    onDataChange?: (data: ScreeningCriteriaDto) => void 
  }) {
  // Single context and weight that applies to all selected criteria
  const [context, setContext] = useState('Looking for team players who thrive in fast-paced environments and strong problem-solving abilities.');
  const [weight, setWeight] = useState(100);

  const allTags: CriteriaKey[] = ['Culture', 'Experience', 'Education', 'Location', 'Salary', 'Skills', 'Others'];

  // Track which tags are currently active/displayed
  const [activeTags, setActiveTags] = useState<CriteriaKey[]>(['Culture']);

  const handleTagClick = (tag: CriteriaKey) => {
    if (activeTags.includes(tag)) {
      // Remove tag only if it's not the last one (at least one must be active)
      if (activeTags.length > 1) {
        const updatedTags = activeTags.filter(t => t !== tag);
        setActiveTags(updatedTags);
        // Send updated data
        onDataChange?.({
          activeCriteria: updatedTags,
          criteriaData: { context, weight }
        });
      }
    } else {
      // Add tag to active tags
      const updatedTags = [...activeTags, tag];
      setActiveTags(updatedTags);
      // Send updated data
      onDataChange?.({
        activeCriteria: updatedTags,
        criteriaData: { context, weight }
      });
    }
  };

  const handleContextChange = (value: string) => {
    setContext(value);
    // Send complete ScreeningCriteriaDto
    onDataChange?.({
      activeCriteria: activeTags,
      criteriaData: { context: value, weight }
    });
  };

  const handleWeightChange = (value: number[]) => {
    setWeight(value[0]);
    // Send complete ScreeningCriteriaDto
    onDataChange?.({
      activeCriteria: activeTags,
      criteriaData: { context, weight: value[0] }
    });
  };


  return (
    <div className="min-h-screen w-full">
      <div className="bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-b-lg space-y-4 sm:space-y-5 lg:space-y-6 max-w-7xl mx-auto">
        <div>
          <Text variant="SubHeadings" as="h1" className="text-base sm:text-xl md:text-2xl">
            Role Requirements Context for Screening (Screening Criteria)
          </Text>

          <Text
            variant="SubText"
            className="mt-1 text-xs sm:text-sm md:text-base"
            color="#0e7490"
          >
            (This section will not be published for public view)
          </Text>
        </div>

        {/* Tag Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-3">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg border transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap ${
                activeTags.includes(tag)
                  ? 'border-brand-primary bg-cyan-50 text-brand-primary font-medium'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {tag} {activeTags.includes(tag) ? (
                <X className="inline-block w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              ) : (
                <Plus className="inline-block w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              )}
            </button>
          ))}
        </div>

        <Text variant="RegularText" className="text-brand-primary text-xs sm:text-sm md:text-base leading-relaxed">
          Provide the screening context and weight for the selected criteria.
        </Text>

        {/* Single context and weight for all selected criteria */}
        <div className="border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 bg-gray-50 space-y-3 sm:space-y-4">
          <Text variant="SubText" className="text-sm sm:text-base lg:text-lg font-semibold">
            Screening Context
          </Text>
          
          <div>
            <Text variant="SubText" className="mb-2 text-xs sm:text-sm lg:text-base font-medium">
              Context:
            </Text>
            <textarea
              value={context}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleContextChange(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-xs sm:text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
              placeholder="Enter the screening context covering the selected criteria..."
            />
          </div>
          
          <div>
            <Text variant="SubText" className="mb-2 text-xs sm:text-sm lg:text-base font-medium">
              Weight: {weight}%
            </Text>
            <div className="px-1">
              <Slider
                value={[weight]}
                onValueChange={(value) => handleWeightChange(value)}
                min={0}
                max={100}
                step={1}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              // Send final data before moving to next step
              onDataChange?.({
                activeCriteria: activeTags,
                criteriaData: { context, weight }
              });
              onNext?.();
            }}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium"
          >
            Next: Application Instructions
          </button>
        </div>
      </div>
    </div>
  );
}