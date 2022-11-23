SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
Create FUNCTION [dbo].[BreakCOA] (@COACODE varchar(400),@Segment nvarchar(20))
RETURNS varchar(400)
AS
BEGIN 
declare @l1 int, @l2 int, @l3 int,@LocationLevel int,@OutputString nvarchar(20)
       

set @OutputString='';


select @LocationLevel=segmentlevel  from segment  where classification=@Segment

If (@LocationLevel=2)
begin  
set @l1= ((select len(CodeLength)  from segment where segmentlevel=1)+(select len(CodeLength)  from segment where segmentlevel=2)+2 );
set @l2=(select len(codelength) from segment where classification=@Segment)+1 ;
set @l3=@l2-1;
end
If (@LocationLevel=3)
begin  
set @l1= ((select len(CodeLength)  from segment where segmentlevel=1)+(select len(CodeLength)  from segment where segmentlevel=2)+
          (select len(CodeLength)  from segment where segmentlevel=3)+3 );
set @l2=(select len(codelength) from segment where classification=@Segment)+1;
set @l3=@l2-1;
end
set @OutputString=(select left(right((left(@COACODE,@l1)),@l2),@l3));

RETURN(@OutputString)
END
GO