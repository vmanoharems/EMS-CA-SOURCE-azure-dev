SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE Procedure [dbo].[GetAllclosedPeriods]
@CompanyId int
As Begin



select *  from ClosePeriod  where CompanyId=@CompanyId and Status='Closed'

end




GO